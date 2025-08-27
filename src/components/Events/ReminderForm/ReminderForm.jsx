import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserFriends } from "../../../utilities/friends-api";
import styles from "./ReminderForm.module.scss";

/**
 * ReminderForm
 * Add / Edit Reminders
 * Fields: title, description, date, time, recurring
 */
function normalizeDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ReminderForm({ onSubmit, submitting, initial, submitLabel }) {
  const location = useLocation();
  let autoLabel = "Save";
  if (location.pathname.includes("/events/new")) autoLabel = "Save Event";
  else if (location.pathname.includes("/edit")) autoLabel = "Save changes";
  const [form, setForm] = useState(() => initial ? {
    title: initial.title || "",
    description: initial.description || "",
    date: normalizeDate(initial.date),
    type: initial.type || "",
    recurring: initial.recurring || false,
    friends: initial.friends || [],
  } : {
    title: "",
    description: "",
    date: "",
    type: "",
    recurring: false,
    friends: [],
  });

  // If initial changes (e.g. when editing), update form state
  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        date: normalizeDate(initial.date),
        type: initial.type || "",
        recurring: initial.recurring || false,
        friends: initial.friends || [],
      });
    }
  }, [initial]);

  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState("");
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingFriends(true);
        const data = await getUserFriends();
        if (mounted) {
          setFriends(Array.isArray(data) ? data : []);
          setFriendsError("");
        }
      } catch (e) {
        if (mounted) setFriendsError(e?.message || "Failed to load friends");
      } finally {
        if (mounted) setLoadingFriends(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleFriendChange(e) {
    const options = Array.from(e.target.selectedOptions);
    const ids = options.map((opt) => opt.value);
    update("friends", ids);
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


      {/* Date + Type + Friends */}
     <div className={styles.row}>
        <label className={styles.label}>Date
          <input
            className={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
          />
        </label>
      </div>

        <div className={styles.grid}>
        <label className={styles.label}>
          Type
          <input
            className={styles.input}
            type="text"
            required
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          />
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.label}>
          Friends
          {loadingFriends ? (
            <span className={styles.hint}>Loading friends…</span>
          ) : friendsError ? (
            <span className={styles.hint} style={{ color: '#ef4444' }}>{friendsError}</span>
          ) : (
            <select
              className={styles.input}
              multiple
              value={form.friends}
              onChange={handleFriendChange}
            >
              {friends.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} {f.nickName ? `(@${f.nickName})` : ""}
                </option>
              ))}
            </select>
          )}
          <span className={styles.hint}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple friends</span>
        </label>
      </div>

      {/* Tags
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
      </div> */}

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
          {submitting ? "Saving…" : (submitLabel || autoLabel)}
        </button>
      </div>
    </form>
  );
}
