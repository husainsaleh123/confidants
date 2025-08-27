// src/components/Stories/StoryCard/StoryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function StoryCard({ story = {}, onClick }) {
  const navigate = useNavigate();
  const { _id, id, title, content, date, createdAt } = story;
  const storyId = _id || id;

  const isValidDate = (d) => {
    const dt = new Date(d);
    return d && !Number.isNaN(dt.getTime()) ? dt : null;
  };
  const formatDayDate = (d) => {
    const dt = isValidDate(d);
    return dt
      ? dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })
      : "";
  };
  const formatLogged = (d) => {
    const dt = isValidDate(d);
    if (!dt) return "";
    const datePart = dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
    const timePart = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  };

  const openView = (e) => {
    e.stopPropagation();
    if (storyId) navigate(`/stories/${storyId}`, { state: { story } });
  };
  const openEdit = (e) => {
    e.stopPropagation();
    if (storyId) navigate(`/stories/${storyId}/edit`, { state: { story } });
  };

  const openFromCard = () => {
    if (storyId) navigate(`/stories/${storyId}`, { state: { story } });
    else if (onClick) onClick(storyId);
  };

  return (
    <article onClick={openFromCard} data-story-id={storyId || ""}>
      <h3>{title || "Untitled story"}</h3>
      {date && <p><strong>Date:</strong> {formatDayDate(date)}</p>}
      {content && <p>{content}</p>}
      {createdAt && <p>Logged on {formatLogged(createdAt)}</p>}

      {storyId && (
        <div>
          <button type="button" onClick={openView}>View</button>
          <button type="button" onClick={openEdit}>Edit</button>
        </div>
      )}
    </article>
  );
}
