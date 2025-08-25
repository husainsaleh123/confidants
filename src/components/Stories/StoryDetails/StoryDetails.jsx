import React from "react";
import styles from "./StoryDetails.module.scss";

export default function StoryDetails({ story = {}, onBack, onEdit, onDelete }) {
  const {
    _id,
    title,
    content,
    date,
    createdAt,
    photos = [],
    mood,
    friendsInvolved = [],
  } = story;

  const isValidDate = (d) => {
    const dt = new Date(d);
    return d && !Number.isNaN(dt.getTime()) ? dt : null;
  };

  const formatDayDate = (d) => {
    const dt = isValidDate(d);
    if (!dt) return "";
    return dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatLogged = (d) => {
    const dt = isValidDate(d);
    if (!dt) return "";
    const datePart = dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
    const timePart = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  };

  const moods = Array.isArray(mood) ? mood.filter(Boolean) : mood ? [mood] : [];

  const handleBack = () => onBack && onBack();
  const handleEdit = () => onEdit && _id && onEdit(_id);
  const handleDelete = () => onDelete && _id && onDelete(_id);

  return (
    <section>
      <div>
        <div>
          {photos.length > 0 ? (
            <>
              <img src={photos[0]} alt={title ? `${title} photo 1` : "story photo"} />
              {photos.length > 1 && (
                <div>
                  {photos.slice(1).map((src, i) => (
                    <img key={i} src={src} alt={title ? `${title} photo ${i + 2}` : `story photo ${i + 2}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>No photo</div>
          )}
        </div>

        <div>
          <h2>{title || "Untitled story"}</h2>

          {date && (
            <p>
              <strong>Date:</strong> {formatDayDate(date)}
            </p>
          )}

          {content && <p>{content}</p>}

          {friendsInvolved.length > 0 && (
            <div>
              <div>
                <strong>Friends involved:</strong>
              </div>
              <div>
                {friendsInvolved.map((f) => (
                  <a key={f?._id || f?.id || String(f)} href={`/friends/${f?._id || f?.id}`}>
                    {f?.name || "Friend"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {moods.length > 0 && (
            <div>
              <div>
                <strong>Mood:</strong>
              </div>
              <div>
                {moods.map((m, i) => (
                  <span key={`${m}-${i}`}>{m}</span>
                ))}
              </div>
            </div>
          )}

          {createdAt && <p>Logged on {formatLogged(createdAt)}</p>}

          <div>
            <button type="button" onClick={handleBack}>&larr; Back</button>
            <button type="button" onClick={handleEdit}>Edit story</button>
            <button type="button" onClick={handleDelete}>Remove story</button>
          </div>
        </div>
      </div>
    </section>
  );
}