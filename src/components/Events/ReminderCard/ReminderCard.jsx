import styles from "./ReminderCard.module.scss";

/**
 * ReminderCard
 * Shows: title, date, description (optional), and linked friends (if any).
 */
export default function ReminderCard({ reminder }) {
  if (!reminder) return null;

  const { title, date, description, friends = [] } = reminder;

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

      {description && <p className={styles.description}>{description}</p>}

      {friends.length > 0 && (
        <div className={styles.friends}>
          <strong>With:</strong>{" "}
          {friends.map((f) => f.name || f.nickName).join(", ")}
        </div>
      )}
    </div>
  );
}
