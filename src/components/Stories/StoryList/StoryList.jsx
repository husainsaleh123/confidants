import React, { useMemo } from "react";
import StoryCard from "../StoryCard/StoryCard";

export default function StoryList({
  stories = [],      // list of story objects
  filters = {},      // optional filters
  sortOrder = "recent", // sort order: "recent" (default) or "oldest"
  onCardClick,       // handler when a card is clicked
}) {
  // helper: safely convert a value to a Date, or null if invalid
  const asDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  // useMemo: only recompute filtering/sorting when inputs change
  const filteredAndSorted = useMemo(() => {
    // destructure possible filters
    const {
      query,          // free-text search
      moods,          // list of moods
      friendIds,      // filter by friends
      dateFrom,       // earliest story date
      dateTo,         // latest story date
      favoritesOnly, // optional if you add a favorite field
    } = filters || {};

    // normalize query
    const q = (query || "").trim().toLowerCase();
    // normalize moods into a Set for quick lookup
    const moodSet = Array.isArray(moods) ? new Set(moods.filter(Boolean)) : null;
    // normalize friends into a Set
    const friendSet = Array.isArray(friendIds) ? new Set(friendIds.filter(Boolean)) : null;

    // normalize date filters
    const from = asDate(dateFrom);
    const to = asDate(dateTo);

    // step 1: filter
    let result = (stories || []).filter((s) => {
      // filter by query across title + content
      if (q) {
        const hay = (s.title || "").toLowerCase() + " " + (s.content || "").toLowerCase();
        if (!hay.includes(q)) return false;
      }


      // filter by friendsInvolved
      if (friendSet && friendSet.size > 0) {
        const ids = (s.friendsInvolved || []).map((f) => f?._id || f?.id).filter(Boolean);
        const any = ids.some((id) => friendSet.has(id));
        if (!any) return false;
      }

      // filter by date range (story.date field, not createdAt)
      if (from || to) {
        const sd = asDate(s.date);
        if (!sd) return false; // no date means exclude if filter is active
        if (from && sd < from) return false;
        if (to && sd > to) return false;
      }

      // optional: favorites only
      if (favoritesOnly && !s.favorite) return false;

      return true; // keep this story
    });

    // step 2: sort by createdAt
    result.sort((a, b) => {
      const da = asDate(a.createdAt) || new Date(0);
      const db = asDate(b.createdAt) || new Date(0);
      // "oldest": ascending (earlier dates first)
      // "recent": descending (newest dates first)
      return sortOrder === "oldest" ? da - db : db - da;
    });

    return result;
  }, [stories, filters, sortOrder]);

  // fallback UI if nothing matches
  if (!filteredAndSorted.length) {
    return <p>No stories found.</p>;
  }

  // render list of StoryCard components
  return (
    <div>
      {filteredAndSorted.map((story) => (
        <StoryCard
          key={story._id || story.id} // mongoose uses _id
          story={story}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}