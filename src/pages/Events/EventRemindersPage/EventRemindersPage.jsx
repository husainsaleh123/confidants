import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./EventRemindersPage.module.scss";

import { getEvents } from "../../../utilities/events-api";

export default function EventRemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // search filter
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvents();
        if (mounted) {
          setReminders(data || []);
          setError("");
        }
      } catch (e) {
        setError(e?.message || "Failed to load reminders.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  
  // apply search filter
  const filtered = useMemo(() => {
    const rgx = q ? new RegExp(q, "i") : null;
    return reminders.filter((r) => {
      return rgx ? rgx.test(r.title) : true;
    });
  }, [reminders, q]);

  return (
    <section className={styles.page}>
      {/* Top bar: count + Add reminder */}
      <div className={styles.topbar}>
        <p className={styles.count}>
          You have {reminders.length} reminder
          {reminders.length === 1 ? "" : "s"}!
        </p>
        <Link to="/reminders/new" className={styles.addBtn}>
          + Add reminder
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Event Reminders</h1>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search reminders..."
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
            <p className={styles.muted}>No reminders found.</p>
          ) : (
            <ul className={styles.list}>
              {filtered.map((r) => (
                <li key={r._id} className={styles.card}>
                  <h2>{r.title}</h2>
                  {r.date && (
                    <p className={styles.date}>
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
