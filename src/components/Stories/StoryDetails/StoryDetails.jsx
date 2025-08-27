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

  const moods = Array.isArray(mood) ? mood.filter(Boolean) : mood ? [mood] : [];

  const handleBack = () => onBack && onBack();
  const handleEdit = () => onEdit && _id && onEdit(_id);
  const handleDelete = () => onDelete && _id && onDelete(_id);

  return (
    <section className={styles.wrapper}>
      <div className={styles.headerRow}>
        <button type="button" className={styles.linkBtn} onClick={handleBack}>
          ← Back
        </button>
      </div>

      <div className={styles.grid}>
        {/* Media column */}
        <div className={styles.media}>
          {photos.length > 0 ? (
            <>
              <img
                className={styles.cover}
                src={photos[0]}
                alt={title ? `${title} photo 1` : "story photo"}
              />

              {photos.length > 1 && (
                <div className={styles.thumbs}>
                  {photos.slice(1).map((src, i) => (
                    <img
                      key={i}
                      className={styles.thumb}
                      src={src}
                      alt={
                        title
                          ? `${title} photo ${i + 2}`
                          : `story photo ${i + 2}`
                      }
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noPhoto}>No photo</div>
          )}
        </div>

        {/* Body column */}
        <div className={styles.body}>
          <h2 className={styles.title}>{title || "Untitled story"}</h2>

          {date && (
            <p className={styles.metaRow}>
              <strong>Date:</strong> {formatDayDate(date)}
            </p>
          )}

          {content && <p className={styles.content}>{content}</p>}

          {friendsInvolved.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupTitle}>
                <strong>Friends involved:</strong>
              </div>
              <div className={styles.friendList}>
                {friendsInvolved.map((f) => (
                  <a
                    key={f?._id || f?.id || String(f)}
                    className={styles.friendLink}
                    href={`/friends/${f?._id || f?.id}`}
                  >
                    {f?.name || "Friend"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {moods.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupTitle}>
                <strong>Mood:</strong>
              </div>
              <div className={styles.chips}>
                {moods.map((m, i) => (
                  <span key={`${m}-${i}`} className={styles.chip}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {createdAt && (
            <p className={styles.logged}>Logged on {formatLogged(createdAt)}</p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleBack}
            >
              ← Back
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleEdit}
              disabled={!_id}
            >
              Edit story
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={handleDelete}
              disabled={!_id}
            >
              Remove story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
