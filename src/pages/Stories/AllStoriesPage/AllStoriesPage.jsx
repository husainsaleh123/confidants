import React, { useEffect, useMemo, useState } from "react";
import StoryList from "../../../components/Stories/StoryList/StoryList";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (k, v) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
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
    const ns =
      location.state &&
      (location.state.newStory ?? location.state.story ?? location.state.data);
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
    const base =
      incomingStories && incomingStories.length > 0 ? incomingStories : baseline;

    const seen = new Set();
    const out = [];

    const pushUnique = (s) => {
      if (!s) return;
      const id = idOf(s);
      const key = id ? `id:${String(id)}` : `noid:${JSON.stringify({ t: s.title, c: s.content, d: s.date, ca: s.createdAt })}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(s);
    };

    extras.forEach(pushUnique);
    base.forEach(pushUnique);
    return out;
  }, [extras, baseline, incomingStories]);

  // ---- UI state & handlers (unchanged) ----
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

  const handleCardClick = (id) => {
    if (onOpenStory) onOpenStory(id);
  };

  const handleAddStory = () => {
    if (onAddStory) onAddStory();
  };

  return (
    <main>
      <section>
        <p>
          You have <strong>{visibleCount}</strong>{" "}
          {visibleCount === 1 ? "story" : "stories"}.
        </p>
        <Link to="/stories/new">+Add story</Link>
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

      <section>
        <StoryList
          stories={displayStories}
          filters={filters}
          sortOrder={sortOrder}
          onCardClick={handleCardClick}
        />
      </section>
    </main>
  );
}