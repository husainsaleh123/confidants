
import { useState } from "react";
import styles from "./UpcomingEvents.module.scss";

/**
 * UpcomingEvents
 * Shows summary of next few events (sorted by date).
 * Props:
 * - reminders: array of reminder objects
 */
export default function UpcomingEvents({ reminders = [] }) {
  if (!reminders.length) return null;

  // Sort by date
  const sorted = [...reminders].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Take first 3 upcoming events
  const next3 = sorted.slice(0, 3);

  return (
    <aside className={styles.box}>
      <h2 className={styles.title}>Upcoming Events</h2>
      <ul className={styles.list}>
        {next3.map((r) => (
          <li key={r.id} className={styles.item}>
            <span className={styles.date}>
              {new Date(r.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <span className={styles.label}>
              {r.type === "birthday"
                ? "🎂"
                : r.type === "event"
                ? "📅"
                : "🎯"}{" "}
              {r.title}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.total}>
        You have {reminders.length} upcoming{" "}
        {reminders.length === 1 ? "event" : "events"}!
      </p>
    </aside>
  );
}
