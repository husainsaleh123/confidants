import { useState, useMemo } from "react";
import styles from "./InteractionForm.module.scss";
import FriendSelector from "../../Stories/FriendSelector/FriendSelector";
import InteractionTypeSelector from "../InteractionTypeSelector/InteractionTypeSelector";
export default function InteractionForm({
  initialData = {},                // { friendsInvolved, date, type, notes }
  heading = "Add Interaction",
  submitLabel = "Save",
  onSubmit,                        // async (payload) => {}
}) {
  const [friendsInvolved, setFriendsInvolved] = useState(
    initialData.friendsInvolved || []
  );
  const [type, setType] = useState(initialData.type || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalize date -> yyyy-mm-dd for <input type="date">
  const initialDate = useMemo(() => {
    if (!initialData.date) return "";
    const d = new Date(initialData.date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, [initialData.date]);

  const [date, setDate] = useState(initialDate);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic client validation
    if (!type) return setError("Please select an interaction type.");
    if (!date) return setError("Please pick a date.");

    const payload = {
      friendsInvolved,               // array of Friend _ids
      type,
      notes: notes?.trim() || "",
      date: date ? new Date(date) : undefined,
    };

    try {
      setLoading(true);
      await onSubmit?.(payload);
    } catch (err) {
      setError(err?.message || "Failed to save interaction.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{heading}</h2>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {/* Date */}
          <div className={styles.row}>
            <label className={styles.label}>Date</label>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className={styles.row}>
            <label className={styles.label}>Type</label>
            <div className={styles.controlRight}>
              <InteractionTypeSelector value={type} onChange={setType} />
            </div>
          </div>

          {/* Notes */}
          <div className={styles.row}>
            <label className={styles.label}>Notes</label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any details…"
            />
          </div>

          {/* Friends */}
          <div className={styles.row}>
            <label className={styles.label}>Friends</label>
            <div className={styles.controlRight}>
              <FriendSelector value={friendsInvolved} onChange={setFriendsInvolved} />
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Saving…" : submitLabel}
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
