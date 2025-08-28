import RecurringToggle from "../RecurringToggle/RecurringToggle";
import styles from "./ReminderCard.module.scss";
import { Link } from "react-router-dom";


export default function ReminderCard({ reminder, showViewButton = false }) {
  if (!reminder) return null;

  const { _id, id, title, date, type, description ,recurring,friends= [] } = reminder;

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
            if (typeof f === "string") return <span key={f}>[Friend]</span>;
            return <span key={f._id || f.name || f.nickName}>{f.name || f.nickName || "[Friend]"}</span>;
          }).reduce((prev, curr) => [prev, ", ", curr])}
        </div>
      )}

       {recurring && typeof recurring === 'string' && !['never', 'false', ''].includes(recurring.toLowerCase()) && (
         <div className={styles.type}>
           <strong>Recurring:</strong> {recurring.charAt(0).toUpperCase() + recurring.slice(1)}
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
