import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./EventRemindersPage.module.scss";

import ReminderList from "../../../components/Events/ReminderList/ReminderList";
import { getEvents } from "../../../utilities/events-api";

export default function EventRemindersPage() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState(""); // search filter

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        const data = await getEvents();
        // ensure data is array
        const events = Array.isArray(data) ? data : [];
        if (mounted) {
          setReminders(events);
          setError("");
        }
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load reminders.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEvents();

    return () => { mounted = false; };
  }, []);

  // search filter
  const filtered = useMemo(() => {
    const rgx = q ? new RegExp(q, "i") : null;
    return reminders.filter((r) => rgx ? rgx.test(r.title) : true);
  }, [reminders, q]);

  return (
    <section className={styles.page}>
      <div className={styles.topbar}>
       
        <p className={styles.count}>
          You have {reminders.length} Event Reminder{reminders.length === 1 ? "" : "s"}!
        </p>
        <Link to="/events/new" className={styles.addBtn}>
          + Add Event Reminders
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Event Reminders</h1>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search Event Reminders..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={styles.search}
          />
        </div>
      </header>

      {loading && <p className={styles.muted}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.content}>
          {filtered.length === 0 ? (
            <p className={styles.muted}>No Event Reminders found.</p>
          ) : (
            <ReminderList reminders={filtered} showViewButton />
          )}
        </div>
      )}
    </section>
  );
}
