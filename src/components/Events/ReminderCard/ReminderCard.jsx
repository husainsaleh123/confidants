import styles from "./ReminderCard.module.scss";
import { Link } from "react-router-dom";

/**
 * ReminderCard
 * Shows: title, date, description (optional), and linked friends (if any).
 */
export default function ReminderCard({ reminder, showViewButton = false }) {
  if (!reminder) return null;

  const { _id, id, title, date, type, description, friends = [] } = reminder;

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <time className={styles.date}>
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </header>

      {type && (
        <div className={styles.type}><strong>Type:</strong> {type}</div>
      )}

      {description && <p className={styles.description}>{description}</p>}

      {friends.length > 0 && (
        <div className={styles.friends}>
          <strong>With:</strong>{" "}
          {friends.map((f) => {
            if (typeof f === "string") return "[Friend]";
            return f.name || f.nickName || "[Friend]";
          }).join(", ")}
        </div>
      )}

      {showViewButton && (
        <div className={styles.actions}>
          <Link
            to={`/events/${_id || id}`}
            className={styles.viewBtn}
          >
            View
          </Link>
        </div>
      )}
    </div>
  );
}
