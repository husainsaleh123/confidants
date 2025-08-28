import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./EditReminderPage.module.scss";

import { getEvent, updateEvent } from "../../../utilities/events-api";
import ReminderForm from "../../../components/Events/ReminderForm/ReminderForm";
import RecurringToggle from "../../../components/Events/RecurringToggle/RecurringToggle";


export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvent(id);
        if (mounted) setEvent(data);
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

  
  const initial = useMemo(() => {
    if (!event) return null;
    
    let friends = [];
    if (Array.isArray(event.friends)) {
      friends = event.friends.map(f => (typeof f === 'string' ? f : f._id || f.id)).filter(Boolean);
    }
    return {
      title: event.title || "",
      date: event.date ? event.date.slice(0, 10) : "",
      type: event.type || "",
      friends : event.friends || [] ,
      description: event.description || "",
      recurring: event.recurring || false,
      friends,
 
    };
  }, [event]);

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title,
        date: form.date || null,
        type: form.type || "",
        friends : form.friends || [] ,
        description: form.description,
        recurring: typeof form.recurring === 'object' ? (form.recurring.enabled ? form.recurring.interval : 'never') : form.recurring || 'never',
      };

      const updated = await updateEvent(id, payload); 
      if (updated && updated._id) navigate(`/events/${updated._id}`);
      else navigate(`/events/${id}`);
    } catch (e) {
      setError(e?.message || "Failed to Save Changes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          {event ? `Edit ${event.title}` : "Edit Event"}
        </h1>
        
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.muted}>Loading…</p>}

      {!loading && event && (
        <div className={styles.card}>
          <ReminderForm
            initial={initial}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      )}
    </section>
  );
}







