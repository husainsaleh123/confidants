import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../../utilities/users-service";
import styles from "./AllStoriesPage.module.scss";

export default function AllStoriesPage({
  stories: incomingStories = [],
  onOpenStory,
  onAddStory,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const idOf = (s) => s?._id || s?.id;

  const readJSON = (k, fallback) => {
    if (typeof window === "undefined") return fallback;
    try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };
  const writeJSON = (k, v) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  };

  const [extras, setExtras] = useState(() => readJSON("stories:extras", []));
  const [baseline, setBaseline] = useState(() => readJSON("stories:lastSnapshot", []));

  useEffect(() => {
    if (!incomingStories || incomingStories.length === 0) return;

    setBaseline(incomingStories);
    writeJSON("stories:lastSnapshot", incomingStories);

    const incomingIds = new Set(incomingStories.map(idOf).filter(Boolean).map(String));
    setExtras((prev) => {
      const next = prev.filter((x) => !incomingIds.has(String(idOf(x))));
      writeJSON("stories:extras", next);
      return next;
    });
  }, [incomingStories]);

  // Merge newly-added story from router state (from AddStoryPage)
  useEffect(() => {
    const ns = location.state && (location.state.newStory ?? location.state.story ?? location.state.data);
    if (!ns || !idOf(ns)) return;

    const withCreatedAt = { createdAt: ns.createdAt || new Date().toISOString(), ...ns };

    setExtras((prev) => {
      const exists = prev.some((s) => String(idOf(s)) === String(idOf(withCreatedAt)));
      const next = exists ? prev : [withCreatedAt, ...prev];
      writeJSON("stories:extras", next);
      return next;
    });

    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate]);

  const displayStories = useMemo(() => {
    const base = incomingStories && incomingStories.length > 0 ? incomingStories : baseline;
    const seen = new Set();
    const out = [];
    const pushUnique = (s) => {
      if (!s) return;
      const id = idOf(s);
      const key = id
        ? `id:${String(id)}`
        : `noid:${JSON.stringify({ t: s.title, c: s.content, d: s.date, ca: s.createdAt })}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(s);
    };
    extras.forEach(pushUnique);
    base.forEach(pushUnique);
    return out;
  }, [extras, baseline, incomingStories]);

  // ---- UI state (search / sort) ----
  const [queryInput, setQueryInput] = useState("");
  const [filters, setFilters] = useState({ query: "" });
  const [sortOrder, setSortOrder] = useState("recent"); // "recent" | "oldest"

  const visibleCount = useMemo(() => {
    const q = (filters?.query || "").trim().toLowerCase();
    if (!q) return displayStories.length;
    return displayStories.filter((s) => {
      const hay = ((s.title || "") + " " + (s.content || "")).toLowerCase();
      return hay.includes(q);
    }).length;
  }, [displayStories, filters]);

  const handleSearch = () => setFilters((p) => ({ ...p, query: queryInput.trim() }));
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const handleClearSearch = () => { setQueryInput(""); setFilters((p) => ({ ...p, query: "" })); };
  const handleSortChange = (e) => setSortOrder(e.target.value === "oldest" ? "oldest" : "recent");

  const handleOpenStory = (sid, s) => {
    if (onOpenStory) onOpenStory(sid);
    else navigate(`/stories/${sid}`, { state: { story: s } });
  };
  const handleAddStory = () => (onAddStory ? onAddStory() : navigate("/stories/new"));

  // helpers for cover + dates
  const asUrl = (v) => (typeof v === "string" ? v : v?.url || v?.src || v?.path || "");
  const firstFromArray = (arr) => (Array.isArray(arr) ? arr.map(asUrl).find(Boolean) || "" : "");
  const firstImageOf = (s) =>
    firstFromArray(s?.photos) ||
    firstFromArray(s?.mediaUrls) ||
    firstFromArray(s?.images) ||
    firstFromArray(s?.media) ||
    asUrl(s?.photoUrl) ||
    asUrl(s?.cover) ||
    "";

  const titleOf = (s) => s?.title || s?.eventName || s?.name || "Untitled story";
  const asDate = (d) => { if (!d) return null; const dt = new Date(d); return Number.isNaN(dt.getTime()) ? null : dt; };
  const fmtDate = (d) => { const dt = asDate(d); return dt ? dt.toLocaleDateString(undefined, { day:"2-digit", month:"long", year:"numeric" }) : ""; };
  const fmtLogged = (d) => { const dt = asDate(d); return dt ? `${dt.toLocaleDateString(undefined,{day:"2-digit",month:"long",year:"numeric"})}, ${dt.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}` : ""; };

  // delete
  async function handleRemove(s) {
    const sid = String(idOf(s) || "").trim();
    if (!sid) return;
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    const token = getToken();
    try {
      const res = await fetch(`/api/stories/${encodeURIComponent(sid)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" },
      });
      if (!res.ok && res.status !== 404) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `HTTP ${res.status}`);
      }
    } catch (err) {
      alert(err?.message || "Failed to delete story.");
      return;
    }

    setExtras((prev) => {
      const next = prev.filter((x) => String(idOf(x)) !== sid);
      writeJSON("stories:extras", next);
      return next;
    });
    setBaseline((prev) => {
      const next = prev.filter((x) => String(idOf(x)) !== sid);
      writeJSON("stories:lastSnapshot", next);
      return next;
    });
  }

  // apply query + sort
  const filteredAndSorted = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();
    const result = displayStories
      .filter((s) => (q ? ((s.title || "") + " " + (s.content || "")).toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const da = asDate(a.createdAt) || new Date(0);
        const db = asDate(b.createdAt) || new Date(0);
        return sortOrder === "oldest" ? da - db : db - da;
      });
    return result;
  }, [displayStories, filters, sortOrder]);

  return (
    <main className={styles.page}>
      {/* top row: count + add button */}
      <section className={styles.topRow}>
        <p className={styles.count}>
          You have <strong>{visibleCount}</strong> {visibleCount === 1 ? "story" : "stories"}.
        </p>
        <button type="button" className={styles.addBtn} onClick={handleAddStory}>+ Add story</button>
      </section>

      {/* filter row */}
      <section className={styles.filterRow}>
        <div className={styles.filterLabel}>
          <span className={styles.filterIcon}>▾</span> Filter by
        </div>
        <select className={styles.select} value={sortOrder} onChange={handleSortChange}>
          <option value="recent">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </section>

      {/* search row */}
      <section className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search story..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {filters.query && (
          <button className={styles.clearBtn} onClick={handleClearSearch} title="Clear search">×</button>
        )}
        <button className={styles.searchBtn} onClick={handleSearch}>
          Search <span className={styles.searchIcon}>🔍</span>
        </button>
      </section>

      {/* cards */}
      <section className={styles.list}>
        {filteredAndSorted.length === 0 ? (
          <p className={styles.empty}>No stories found.</p>
        ) : (
          filteredAndSorted.map((s) => {
            const sid = idOf(s);
            const cover = firstImageOf(s);
            return (
              <article key={sid || Math.random()} className={styles.card}>
                <div className={styles.coverWrap}>
                  {cover ? (
                    <img className={styles.cover} src={cover} alt={`${titleOf(s)} cover`} />
                  ) : (
                    <div className={styles.coverPlaceholder} />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.title}>{titleOf(s)}</h2>

                  {s.date && (
                    <div className={styles.meta}><strong>Date:</strong> {fmtDate(s.date)}</div>
                  )}

                  {s.content && <p className={styles.excerpt}>{s.content}</p>}

                  {s.createdAt && (
                    <div className={styles.logged}>Logged on {fmtLogged(s.createdAt)}</div>
                  )}

                  {sid && (
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => handleOpenStory(sid, s)}
                      >
                        View story
                      </button>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(s)}
                      >
                        Remove story
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
