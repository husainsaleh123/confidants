import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./EventRemindersPage.module.scss";

import ReminderList from "../../../components/Events/ReminderList/ReminderList";
import { getEvents } from "../../../utilities/events-api";

export default function EventRemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // فرقنا بين النص المكتوب (searchText) واللي نبحث به فعلاً (query)
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        const data = await getEvents();
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

  const filtered = useMemo(() => {
    const rgx = query ? new RegExp(query, "i") : null;
    return reminders.filter((r) => (rgx ? rgx.test(r.title) : true));
  }, [reminders, query]);

  return (
    <section className={styles.page}>
      <div className={styles.topRow}>
        <p className={styles.count}>
          You have {reminders.length} Event Reminder
          {reminders.length === 1 ? "" : "s"}!
        </p>
        <Link to="/events/new" className={styles.addBtn}>
          + Add Event Reminders
        </Link>
      </div>

      <div className={styles.searchRow}>
        <input
          type="search"
          placeholder="Search Event Reminders..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
        <button
          onClick={() => { setQuery(searchText); }}
          className={styles.searchBtn}
        >
          Search
        </button>
        <button
          onClick={() => { setSearchText(""); setQuery(""); }}
          className={styles.clearBtn}
        >
          Clear
        </button>
      </div>

      {loading && <p className={styles.empty}>Loading…</p>}
      {error && <p className={styles.empty}>{error}</p>}

      {!loading && !error && (
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <p className={styles.empty}>No Event Reminders found.</p>
          ) : (
            <ReminderList reminders={filtered} showViewButton /> 
          )}
        </div>
      )}
    </section>
  );
}
