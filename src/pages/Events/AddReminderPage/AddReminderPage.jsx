import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AddReminderPage.module.scss";
import ReminderForm from "../../../components/Events/ReminderForm/ReminderForm";
import RecurringToggle from "../../../components/Events/RecurringToggle/RecurringToggle";
import { Button } from "../../../components/Button/Button"; 
import { createEvent } from "../../../utilities/events-api";

export default function AddEventPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title,
        date: form.date || null,
        type: form.type || "",
        description: form.description || "",
        recurring: form.recurring || false,
        // tags: (form.tags || "")
        //   .split(",")
        //   .map((t) => t.trim())
        //   .filter(Boolean),
      };

      const created = await createEvent(payload);
      if (created && created._id) navigate(`/events/${created._id}`);
      else navigate("/events");
    } catch (e) {
      setError(e?.message || "Failed to add reminder.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Add a new reminder</h1>
        <Link to="/events" className={styles.backBtn}>
          ← Back to all events
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <RecurringToggle />
        <ReminderForm onSubmit={handleSubmit} submitting={submitting} />
        <div className={styles.actions}>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Reminder"}
          </Button>
        </div>
      </div>
    </section>
  );
}
