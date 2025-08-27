
import ReminderCard from "../ReminderCard/ReminderCard";
import styles from "./ReminderList.module.scss";


export default function ReminderList({ reminders = [], showViewButton = false }) {
  if (!reminders.length) {
    return <p className={styles.empty}>No Event Reminders found.</p>;
  }

  return (
    <div className={styles.grid}>
      {reminders.map((rem) => (
        <ReminderCard key={rem.id} reminder={rem} showViewButton={showViewButton} />
      ))}
    </div>
  );
}
