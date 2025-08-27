import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ShowReminderPage.module.scss";

import { getEvent, deleteEvent } from "../../../utilities/events-api";
import ReminderCard from "../../../components/Events/ReminderCard/ReminderCard";

export default function ShowEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvent(id);
        if (mounted) {
          setEvent(data);
          setError("");
        }
      } catch (e) {
        setError(e?.message || "Failed to load event.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleRemove() {
    try {
      await deleteEvent(id);
      navigate("/events"); // back to EventRemindersPage after deletion
    } catch (e) {
      setError(e?.message || "Failed to remove event.");
    }
  }

  return (
    <section className={styles.page}>
      {/* Header actions */}
      <div className={styles.actionsBar}>
        <Link to="/events" className={styles.backBtn}>← Back</Link>
        <div className={styles.spacer} />
        
      </div>

      {loading && <p className={styles.muted}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && event && (
        <ReminderCard reminder={event} />
      )}

      <div className={styles.rightActions}>
          <Link to={`/events/${id}/edit`} className={styles.editBtn}>Edit event</Link>
          <button type="button" className={styles.removeBtn} onClick={handleRemove}>
            Remove event
          </button>
        </div>
    </section>
  );
}
