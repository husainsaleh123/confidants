// src/pages/EditStoryPage/EditStoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function EditStoryPage({
  story: initialStory = null,
  storyId,
  loadStory,
  updateStory,
  friendsOptions: incomingFriends = [],
  fetchFriends,
  moodOptions: incomingMoods = [],
  fetchMoods,
  onCancel,
  onSaved,
}) {
  // ---------- loading / data ----------
  const [story, setStory] = useState(initialStory);
  const [loading, setLoading] = useState(!initialStory && !!storyId);
  const [error, setError] = useState("");

  const [friendsOptions, setFriendsOptions] = useState(incomingFriends);
  const [moodOptions, setMoodOptions] = useState(
    incomingMoods.length
      ? incomingMoods
      : ["Happy", "Nostalgic", "Excited", "Calm", "Proud", "Grateful"]
  );

  useEffect(() => {
    setFriendsOptions(incomingFriends || []);
  }, [incomingFriends]);

  useEffect(() => {
    if (incomingMoods?.length) setMoodOptions(incomingMoods);
  }, [incomingMoods]);

  // Load story if only id provided
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (initialStory) {
        setStory(initialStory);
        setLoading(false);
        return;
      }
      if (!storyId || !loadStory) return;

      try {
        setLoading(true);
        const s = await loadStory(storyId);
        if (!cancelled) setStory(s || null);
      } catch {
        if (!cancelled) setError("Failed to load story.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialStory, storyId, loadStory]);

  // Optionally fetch friends + moods
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (fetchFriends) {
        try {
          const list = await fetchFriends();
          if (!cancelled && Array.isArray(list)) setFriendsOptions(list);
        } catch {
          /* ignore */
        }
      }
      if (fetchMoods) {
        try {
          const list = await fetchMoods();
          if (!cancelled && Array.isArray(list) && list.length) setMoodOptions(list);
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchFriends, fetchMoods]);

  // ---------- form state ----------
  const normId = (x) => x?._id ||_
