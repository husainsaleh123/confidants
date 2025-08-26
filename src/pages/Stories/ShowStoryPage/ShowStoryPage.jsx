// src/pages/ShowStoryPage/ShowStoryPage.jsx
import React, { useEffect, useState } from "react";
import StoryDetails from "../../../components/Stories/StoryDetails/StoryDetails";

export default function ShowStoryPage({
  story: initialStory,
  storyId,
  loadStory,
  onBack,
  onEdit,
  onDelete,
}) {
  const [story, setStory] = useState(initialStory || null);
  const [loading, setLoading] = useState(!initialStory && !!storyId);
  const [error, setError] = useState("");

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
    return () => { cancelled = true; };
  }, [initialStory, storyId, loadStory]);

  if (loading) return <main><p>Loading story…</p></main>;
  if (error)   return <main><p>{error}</p></main>;
  if (!story)  return <main><p>Story not found.</p></main>;

  return (
    <main>
      <h1>ShowStoryPage</h1>
      <StoryDetails
        story={story}
        onBack={onBack}
        onEdit={(id) => onEdit && onEdit(id)}
        onDelete={(id) => onDelete && onDelete(id)}
      />
    </main>
  );
}
