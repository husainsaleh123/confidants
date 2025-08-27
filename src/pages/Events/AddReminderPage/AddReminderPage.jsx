import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AddReminderPage.module.scss";
import ReminderForm from "../../../components/Events/ReminderForm/ReminderForm";
import RecurringToggle from "../../../components/Events/RecurringToggle/RecurringToggle";
// import { Button } from "../../../components/Button/Button"; 
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
        friends : form.friends || [] ,
        description: form.description || "",
        recurring: typeof form.recurring === 'object' ? (form.recurring.enabled ? form.recurring.interval : 'never') : form.recurring || 'never',
      };

      const created = await createEvent(payload);
      if (created && created._id) navigate(`/events/${created._id}`);
      else navigate("/events");
    } catch (e) {
      setError(e?.message || "Failed to add Event Reminders.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Add a New Event </h1>
        {/* <Link to="/events" className={styles.backBtn}>
          ← Back to all Events
        </Link> */}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        {/* <RecurringToggle /> */}
        <ReminderForm onSubmit={handleSubmit} submitting={submitting} />
        {/* make the Button component to fix this */}
        <div className={styles.actions}>
          {/* <button type="submit" > */}
            {/* {submitting ? "Saving..." : "Save Reminder"} */}
            {/* save
         </button> */}
        </div>
      </div>
    </section>
  );
}
