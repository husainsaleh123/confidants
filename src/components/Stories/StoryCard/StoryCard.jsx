// src/components/Stories/StoryCard/StoryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import styles from "./StoryCard.module.scss"; // keep or remove as you like

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
    if (!dt) return "";
    return dt.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatLogged = (d) => {
    const dt = isValidDate(d);
    if (!dt) return "";
    const datePart = dt.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const timePart = dt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart}, ${timePart}`;
  };

  // Card click → open Show page
  const handleCardOpen = () => {
    if (storyId) navigate(`/stories/${storyId}`);
  };

  // Buttons (stop bubbling so card click doesn't double-fire)
  const goView = (e) => {
    e.stopPropagation();
    if (storyId) navigate(`/stories/${storyId}`);
  };
  const goEdit = (e) => {
    e.stopPropagation();
    if (storyId) navigate(`/stories/${storyId}/edit`);
  };

  return (
    <article
      onClick={handleCardOpen}
      style={{ cursor: "pointer" }}
      // className={styles?.root}
      data-story-id={storyId || ""}
    >
      <h3>{title || "Untitled story"}</h3>

      {date && (
        <p>
          <strong>Date:</strong> {formatDayDate(date)}
        </p>
      )}

      {content && <p>{content}</p>}

      {createdAt && <p>Logged on {formatLogged(createdAt)}</p>}

      {/* Actions */}
      <div>
        <button type="button" onClick={goView} disabled={!storyId}>
          View
        </button>
     
        <button type="button" onClick={goEdit} disabled={!storyId}>
          Edit
        </button>
      </div>
    </article>
  );
}
