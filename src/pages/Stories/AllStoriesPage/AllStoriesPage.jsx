import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../../utilities/users-service";

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

  // When returning from AddStoryPage, merge new story from route state -> extras
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

    // Clear route state so back/refresh doesn't re-insert
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

  // ---- UI state & handlers (search / filter) ----
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

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setQueryInput("");
    setFilters((prev) => ({ ...prev, query: "" }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortOrder(val === "oldest" ? "oldest" : "recent");
  };

  const handleOpenStory = (sid, s) => {
    if (onOpenStory) onOpenStory(sid);
    else navigate(`/stories/${sid}`, { state: { story: s } });
  };

  const handleAddStory = () => {
    if (onAddStory) onAddStory();
    else navigate("/stories/new");
  };

  // ---- Helpers for image + labels + dates ----
  const asUrl = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v.url || v.src || v.path || "";
    return "";
  };
  const firstFromArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    for (const item of arr) {
      const u = asUrl(item);
      if (u) return u;
    }
    return "";
  };
  const firstImageOf = (s) =>
    firstFromArray(s?.photos) ||
    firstFromArray(s?.mediaUrls) ||
    firstFromArray(s?.images) ||
    firstFromArray(s?.media) ||
    asUrl(s?.photoUrl) ||
    asUrl(s?.cover) ||
    "";

  const titleOf = (s) => s?.title || s?.eventName || s?.name || "Untitled story";

  const asDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };
  const fmtDate = (d) => {
    const dt = asDate(d);
    return dt ? dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" }) : "";
  };
  const fmtLogged = (d) => {
    const dt = asDate(d);
    if (!dt) return "";
    const datePart = dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
    const timePart = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  };

  // Direct delete from the list (JWT via getToken). Treat 404/not found as success.
  async function handleRemove(s) {
    const sid = String(idOf(s) || "").trim();
    if (!sid) return;
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    const token = getToken();
    const url = `/api/stories/${encodeURIComponent(sid)}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
          : { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const lower = (text || "").toLowerCase();
        if (res.status !== 404 && !lower.includes("not found")) {
          throw new Error(text || `HTTP ${res.status}`);
        }
      }
    } catch (err) {
      const lower = String(err?.message || "").toLowerCase();
      if (!lower.includes("not found")) {
        alert(err?.message || "Failed to delete story.");
        return;
      }
    }

    // Remove from local state + caches
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

  // Apply query + sort for rendering
  const filteredAndSorted = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();

    let result = displayStories.filter((s) => {
      if (!q) return true;
      const hay = ((s.title || "") + " " + (s.content || "")).toLowerCase();
      return hay.includes(q);
    });

    result.sort((a, b) => {
      const da = asDate(a.createdAt) || new Date(0);
      const db = asDate(b.createdAt) || new Date(0);
      return sortOrder === "oldest" ? da - db : db - da;
    });

    return result;
  }, [displayStories, filters, sortOrder]);

  return (
    <main>
      <section>
        <p>
          You have <strong>{visibleCount}</strong> {visibleCount === 1 ? "story" : "stories"}.
        </p>
        <button type="button" onClick={handleAddStory}>+ Add story</button>
      </section>

      <section>
        <label>
          Filter by{" "}
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="recent">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>

        <input
          type="text"
          placeholder="Search story..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {filters.query && <button onClick={handleClearSearch}>Clear</button>}
        <button onClick={handleSearch}>Search</button>
      </section>

      {/* Render cards with image (left) + details (right) */}
      <section>
        {filteredAndSorted.length === 0 ? (
          <p>No stories found.</p>
        ) : (
          filteredAndSorted.map((s) => {
            const sid = idOf(s);
            const cover = firstImageOf(s);
            return (
              <article key={sid || Math.random()}>
                {/* left: image */}
                {cover ? (
                  <img src={cover} alt={titleOf(s) + " cover"} />
                ) : (
                  <div>No image</div>
                )}

                {/* right: details */}
                <div>
                  <h2>{titleOf(s)}</h2>
                  {s.date ? <div><strong>Date:</strong> {fmtDate(s.date)}</div> : null}
                  {s.content ? <p>{s.content}</p> : null}
                  {s.createdAt ? <p>Logged on {fmtLogged(s.createdAt)}</p> : null}

                  {sid && (
                    <div>
                      <button type="button" onClick={() => handleOpenStory(sid, s)}>
                        View story
                      </button>{" "}
                      <button type="button" onClick={() => handleRemove(s)}>
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
