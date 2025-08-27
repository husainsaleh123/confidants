import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./InteractionCard.module.scss";


export default function InteractionCard({ item }) {
  const nav = useNavigate();
  const location = useLocation();

  if (!item) return null;

  const { _id, name, date, description, friends = [] } = item;

  const prettyDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  // ✅ detect if we're on `/interactions/:id`
  const isDetailPage = location.pathname === `/interactions/${_id}`;

  const handleView = () => nav(`/interactions/${_id}`);

  return (
    <article className="ix-card">
      <h2 className="ix-title">{name}</h2>
      <p className="ix-date">
        <strong>Date:</strong> {prettyDate}
      </p>

      {description && <p className="ix-desc">{description}</p>}

      {friends.length > 0 && (
        <div className="ix-friends">
          <strong>Friends:</strong>
          <div className="ix-friend-chips">
            {friends.map((f) => (
              <span className="ix-chip" key={f._id || f.name}>
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ✅ show "View interaction" only if not on detail page */}
      {!isDetailPage && (
        <div className="ix-actions">
          <button
            type="button"
            className="ix-btn ix-btn-primary"
            onClick={handleView}
          >
            View interaction
          </button>
        </div>
      )}
    </article>
  );
}
