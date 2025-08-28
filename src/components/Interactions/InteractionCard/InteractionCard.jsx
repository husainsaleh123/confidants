import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteInteraction } from "../../../utilities/interaction-api"; // optional fallback
import styles from "./InteractionCard.module.scss";

export default function InteractionCard({ item, onDelete }) {
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

  const isDetailPage = location.pathname === `/interactions/${_id}`;

  const handleView = () => nav(`/interactions/${_id}`);

  const handleDelete = async () => {
    if (!window.confirm("Delete this interaction?")) return;

    try {
      if (typeof onDelete === "function") {
        await onDelete(_id); // defer to parent if provided
      } else {
        // sensible fallback so the card also works in lists
        await deleteInteraction(_id);
        if (isDetailPage) nav("/interactions");
      }
    } catch (e) {
      console.error("Failed to delete interaction:", e);
      alert("Failed to delete interaction.");
    }
  };

  return (
    <article className="ix-card ix-card--compact">
      <h2 className="ix-title">{name}</h2>
      <p className="ix-date"><strong>Date:</strong> {prettyDate}</p>

      {description && <p className="ix-desc">{description}</p>}

      {friends.length > 0 && (
        <div className="ix-friends">
          <strong>Friends:</strong>
          <div className="ix-friend-chips">
            {friends.map((f) => (
              <span className="ix-chip" key={f._id || f.name}>{f.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="ix-actions">
        {!isDetailPage && (
          <button type="button" className="ix-btn ix-btn-primary" onClick={handleView}>
            View interaction
          </button>
        )}

        {isDetailPage && (
          <button type="button" className="ix-btn ix-btn-ghost" onClick={() => nav("/interactions")}>
            ← Back
          </button>
        )}

        <div className="ix-spacer" />

        <button
          type="button"
          className="ix-btn ix-btn-outline"
          onClick={() => nav(`/interactions/${_id}/edit`)}
        >
          Edit
        </button>

        <button type="button" className="ix-btn ix-btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
