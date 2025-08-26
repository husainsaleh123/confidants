import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// adjust the path if your utilities file lives elsewhere
import {
  updateInteraction,
  deleteInteraction,
} from "../../../utilities/interaction-api";

export default function InteractionCard({ item }) {
  // item: { _id, name, date, description, friends:[{_id,name}], favourite }
  const nav = useNavigate();
  const [fav, setFav] = useState(!!item?.favourite);
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!item || deleted) return null;

  const { _id, name, date, description, friends = [] } = item;

  const prettyDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  // toggle favourite (no parent callback)
  const handleFavourite = async () => {
    if (busy) return;
    const next = !fav;
    setBusy(true);
    setFav(next); // optimistic UI
    try {
      await updateInteraction(_id, { favourite: next });
    } catch (err) {
      console.error(err);
      setFav(!next); // revert on error
      alert("Failed to update favourite");
    } finally {
      setBusy(false);
    }
  };

  // view interaction
  const handleView = () => nav(`/interactions/${_id}`);

  // remove interaction (hide locally after API success)
  const handleRemove = async () => {
    if (busy) return;
    if (!confirm("Delete")) return;
    setBusy(true);
    try {
      await deleteInteraction(_id);
      setDeleted(true); // hide this card locally
    } catch (e) {
      console.error(e);
      alert("card not removed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="ix-card">
      {/* top-right star */}
      <button
        className={`ix-star ${fav ? "is-on" : ""}`}
        aria-label={fav ? "Remove from favourites" : "Add to favourites"}
        title={fav ? "Remove from favourites" : "Add to favourites"}
        onClick={handleFavourite}
        disabled={busy}
      >
        ★
      </button>

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

      <div className="ix-actions">
        <button
          type="button"
          className="ix-btn ix-btn-primary"
          onClick={handleView}
          disabled={busy}
        >
          View interaction
        </button>
        <button
          type="button"
          className="ix-btn ix-btn-danger"
          onClick={handleRemove}
          disabled={busy}
        >
          Remove interaction
        </button>
      </div>
    </article>
  );
}
