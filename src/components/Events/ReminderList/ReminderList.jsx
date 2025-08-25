import ReminderCard from "../ReminderCard/ReminderCard";
import styles from "./ReminderList.module.scss";

/**
 * ReminderList
 * Shows a list of reminders using ReminderCard.
 * Props:
 * - reminders: array of reminder objects
 */
export default function ReminderList({ reminders = [] }) {
  if (!reminders.length) {
    return <p className={styles.empty}>No reminders found.</p>;
  }

  return (
    <div className={styles.grid}>
      {reminders.map((rem) => (
        <ReminderCard key={rem.id} reminder={rem} />
      ))}
    </div>
  );
}
