import styles from "./ReminderCard.module.scss";

export default function ReminderCard({ reminder }) {
  const {
    title,
    date,
    notes,
    friends = [],
    isFavorite = false,
  } = reminder || {};

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.ident}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.date}>Date: {fmt(date)}</p>
        </div>
        <button className={styles.star} aria-label="Favorite">
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      {notes && <p className={styles.notes}>{notes}</p>}

      <div className={styles.row}>
        <span className={styles.rowLabel}>Friends:</span>
        <div className={styles.chips}>
          {friends.length ? (
            friends.map((f) => (
              <span key={f} className={styles.chip}>
                {f}
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.viewBtn}>View event</button>
        <button className={styles.removeBtn}>Remove event</button>
      </div>
    </article>
  );
}
