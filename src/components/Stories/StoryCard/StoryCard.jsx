// src/components/Stories/StoryCard/StoryCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./StoryCard.module.scss";

export default function StoryCard({ story = {}, onClick }) {
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

  // Prevent the card-level onClick from triggering when clicking the links
  const stop = (e) => e.stopPropagation();

  return (
    <article
      onClick={() => onClick && storyId && onClick(storyId)}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className={styles?.root}
    >
      {/* Title */}
      <h3>{title || "Untitled story"}</h3>

      {/* Date of the story */}
      {date && (
        <p>
          <strong>Date:</strong> {formatDayDate(date)}
        </p>
      )}

      {/* Short description (content) */}
      {content && <p>{content}</p>}

      {/* Logged timestamp */}
      {createdAt && <p>Logged on {formatLogged(createdAt)}</p>}

      {/* Actions */}
      {storyId && (
        <nav>
          <Link to={`/stories/${storyId}`} onClick={stop}>
            View
          </Link>
          {" | "}
          <Link to={`/stories/${storyId}/edit`} onClick={stop}>
            Edit
          </Link>
        </nav>
      )}
    </article>
  );
}
