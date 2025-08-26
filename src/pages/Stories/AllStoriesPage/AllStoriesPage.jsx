// src/pages/Stories/AllStoriesPage/AllStoriesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import StoryList from "../../../components/Stories/StoryList/StoryList";

export default function AllStoriesPage({
  stories: incomingStories = [],
  onOpenStory,
  onAddStory,
}) {
  const [stories, setStories] = useState(incomingStories);
  const [queryInput, setQueryInput] = useState("");
  const [filters, setFilters] = useState({ query: "" });
  const [sortOrder, setSortOrder] = useState("recent"); // "recent" | "oldest"

  useEffect(() => {
    setStories(incomingStories || []);
  }, [incomingStories]);

  const visibleCount = useMemo(() => {
    const q = (filters?.query || "").trim().toLowerCase();
    if (!q) return stories.length;
    return stories.filter((s) => {
      const hay = ((s.title || "") + " " + (s.content || "")).toLowerCase();
      return hay.includes(q);
    }).length;
  }, [stories, filters]);

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
        <button onClick={handleAddStory}>+ Add story</button>
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
          stories={stories}
          filters={filters}
          sortOrder={sortOrder}
          onCardClick={handleCardClick}
        />
      </section>
    </main>
  );
}
