import { useState } from "react";
import styles from "./ReminderForm.module.scss";

/**
 * ReminderForm
 * Add / Edit Reminders
 * Fields: title, description, date, time, tags, recurring
 */
export default function ReminderForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    tags: "",
    recurring: false,
  });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Top row: title + description */}
      <div className={styles.identityRow}>
        <div className={styles.nameCol}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              type="text"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g., Dentist Appointment"
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.input}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional details about this reminder"
            />
          </label>
        </div>
      </div>

      {/* Date + Time */}
      <div className={styles.grid}>
        <label className={styles.label}>
          Date
          <input
            className={styles.input}
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Time
          <input
            className={styles.input}
            type="time"
            required
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          />
        </label>
      </div>

      {/* Tags */}
      <div className={styles.row}>
        <label className={styles.label}>
          Tags
          <input
            className={styles.input}
            type="text"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="e.g., health, family, work"
          />
          <p className={styles.hint}>Separate with commas</p>
        </label>
      </div>

      {/* Recurring toggle */}
      <div className={styles.row}>
        <label className={styles.labelInline}>
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) => update("recurring", e.target.checked)}
          />
          <span>Repeat this reminder</span>
        </label>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Save Reminder"}
        </button>
      </div>
    </form>
  );
}
