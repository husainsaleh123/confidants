import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import { getEvents } from "../../utilities/events-api";
import ReminderList from "../../components/Events/ReminderList/ReminderList";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("week"); // default: 1 week

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        const data = await getEvents();
        if (mounted) {
          setEvents(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load events.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEvents();

    return () => { mounted = false; };
  }, []);

  // Filter events based on timeframe
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === "week") {
      cutoff.setDate(now.getDate() + 7);
    } else if (timeframe === "2weeks") {
      cutoff.setDate(now.getDate() + 14);
    } else if (timeframe === "month") {
      cutoff.setMonth(now.getMonth() + 1);
    } else if (timeframe === "3months") {
      cutoff.setMonth(now.getMonth() + 3);
    }

    return events.filter(ev => {
      const eventDate = new Date(ev.date);
      return eventDate >= now && eventDate <= cutoff;
    });
  }, [events, timeframe]);

  return (
    <main className={styles.Home}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1>Upcoming Events</h1>
          <div className={styles.links}>
            <Link to="/events" className={styles.link}>All Events</Link>
            <Link to="/events/new" className={styles.link}>+ New Event</Link>
          </div>
        </div>
        <div className={styles.controls}>
          <label>
            Show events in:
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="week">Next 1 Week</option>
              <option value="2weeks">Next 2 Weeks</option>
              <option value="month">Next 1 Month</option>
              <option value="3months">Next 3 Months</option>
            </select>
          </label>
        </div>
      </header>

      {loading && <p>Loading events…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.content}>
          {filteredEvents.length === 0 ? (
            <p>No upcoming events in the selected timeframe.</p>
          ) : (
            <ReminderList reminders={filteredEvents} />
          )}
        </div>
      )}
    </main>
  );
}
