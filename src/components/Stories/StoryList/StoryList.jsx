// src/components/Stories/StoryList/StoryList.jsx
import React, { useMemo } from "react";
import StoryCard from "../StoryCard/StoryCard";
import styles from "./StoryList.module.scss";

export default function StoryList({
  stories = [],
  filters = {},
  sortOrder = "recent", // "recent" or "oldest"
  onCardClick,
}) {
  const asDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const filteredAndSorted = useMemo(() => {
    const {
      query,
      moods,          // array of mood keys to include
      friendIds,      // array of friend IDs to match any
      dateFrom,       // inclusive
      dateTo,         // inclusive
      favoritesOnly,  // boolean
    } = filters || {};

    const q = (query || "").trim().toLowerCase();
    const moodSet = Array.isArray(moods) ? new Set(moods.filter(Boolean)) : null;
    const friendSet = Array.isArray(friendIds) ? new Set(friendIds.filter(Boolean)) : null;

    const from = asDate(dateFrom);
    const to = asDate(dateTo);

    let result = (stories || []).filter((s) => {
      // text search across title + content
      if (q) {
        const hay =
          (s.title || "").toLowerCase() +
          " " +
          (s.content || "").toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // mood filter (accept if any of the story moods is in moodSet)
      if (moodSet && moodSet.size > 0) {
        const storyMoods = Array.isArray(s.moods)
          ? s.moods.filter(Boolean)
          : s.mood
          ? [s.mood]
          : [];
        const hasAnyMood = storyMoods.some((m) => moodSet.has(m));
        if (!hasAnyMood) return false;
      }

      // friend filter (any friend involved)
      if (friendSet && friendSet.size > 0) {
        const ids = (s.friendsInvolved || [])
          .map((f) => f?._id || f?.id)
          .filter(Boolean);
        const hasAnyFriend = ids.some((id) => friendSet.has(id));
        if (!hasAnyFriend) return false;
      }

      // date range on s.date (not createdAt)
      if (from || to) {
        const sd = asDate(s.date);
        if (!sd) return false;
        if (from && sd < from) return false;
        if (to && sd > to) return false;
      }

      // favorites
      if (favoritesOnly && !s.favorite) return false;

      return true;
    });

    // sort by createdAt
    result.sort((a, b) => {
      const da = asDate(a.createdAt) || new Date(0);
      const db = asDate(b.createdAt) || new Date(0);
      return sortOrder === "oldest" ? da - db : db - da; // recent = newest first
    });

    return result;
  }, [stories, filters, sortOrder]);

  if (!filteredAndSorted.length) {
    return (
      <div className={styles.empty}>
        <p>No stories found.</p>
      </div>
    );
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {filteredAndSorted.map((story) => (
          <StoryCard
            key={story._id || story.id}
            story={story}
            onClick={onCardClick}
          />
        ))}
      </div>
    </section>
  );
}
