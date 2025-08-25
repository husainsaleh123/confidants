import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./EditReminderPage.module.scss";

import { getEvent, updateEvent } from "../../../utilities/events-api";
import ReminderForm from "../../../components/Events/ReminderForm/ReminderForm";
import RecurringToggle from "../../../components/Events/RecurringToggle/RecurringToggle";
import { Button } from "../../../components/Button/Button";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing event
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

  // Prepare initial values for the form
  const initial = useMemo(() => {
    if (!event) return null;
    const join = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
    return {
      title: event.title || "",
      description: event.description || "",
      date: event.date ? event.date.slice(0, 10) : "",
      time: event.time || "",
      recurring: event.recurring || false,
      tags: join(event.tags),
    };
  }, [event]);

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title,
        description: form.description,
        date: form.date || null,
        time: form.time || null,
        recurring: form.recurring || false,
        tags: String(form.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const updated = await updateEvent(id, payload); // PUT /api/events/:id
      if (updated && updated._id) navigate(`/events/${updated._id}`);
      else navigate(`/events/${id}`);
    } catch (e) {
      setError(e?.message || "Failed to save changes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          {event ? `Edit ${event.title}` : "Edit event"}
        </h1>
        <Link to={`/events/${id}`} className={styles.backBtn}>
          ← Back
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.muted}>Loading…</p>}

      {!loading && event && (
        <div className={styles.card}>
          <RecurringToggle
            initialValue={event.recurring}
            disabled={submitting}
          />
          <ReminderForm
            initial={initial}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
          <div className={styles.actions}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
