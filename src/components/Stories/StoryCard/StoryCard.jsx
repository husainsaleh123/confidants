// src/components/Stories/StoryCard/StoryCard.jsx
import React from "react";
import styles from "./StoryCard.module.scss";

export default function StoryCard({ story = {}, onClick }) {
  const { _id, title, content, date, createdAt } = story;

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

  return (
    <article
      onClick={() => onClick && _id && onClick(_id)}
      style={{ cursor: onClick ? "pointer" : "default" }}
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
    </article>
  );
}
