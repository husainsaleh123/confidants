import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteInteraction } from "../../../utilities/interaction-api";
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
        await onDelete(_id);
      } else {
        await deleteInteraction(_id);
        if (isDetailPage) nav("/interactions");
      }
    } catch (e) {
      console.error("Failed to delete interaction:", e);
      alert("Failed to delete interaction.");
    }
  };

  return (
    <article className={`${styles.card} ${styles.compact}`}>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.date}><strong>Date:</strong> {prettyDate}</p>

      {description && <p className={styles.desc}>{description}</p>}

      {friends.length > 0 && (
        <div className={styles.friends}>
          <strong>Friends:</strong>
          <div className={styles.friendChips}>
            {friends.map((f) => (
              <span className={styles.chip} key={f._id || f.name}>{f.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {!isDetailPage && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleView}>
            View interaction
          </button>
        )}

        {isDetailPage && (
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => nav("/interactions")}>
            ← Back
          </button>
        )}

        <div className={styles.spacer} />

        <button
          type="button"
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={() => nav(`/interactions/${_id}/edit`)}
        >
          Edit
        </button>

        <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
