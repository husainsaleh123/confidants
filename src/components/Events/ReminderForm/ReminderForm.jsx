import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserFriends } from "../../../utilities/friends-api";
import styles from "./ReminderForm.module.scss";
import FriendSelector from "../../../components/Stories/FriendSelector/FriendSelector"; 
import RecurringToggle from "../RecurringToggle/RecurringToggle";


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
    recurring: initial.recurring || "",
    friends: initial.friends || [],
  } : {
    title: "",
    description: "",
    date: "",
    type: "",
    recurring: "",
    friends: [],
  });


  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        date: normalizeDate(initial.date),
        type: initial.type || "",
        recurring: initial.recurring || "",
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



  function handleFriendSelectorChange(selected) {
    update("friends", selected);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit?.({ ...form });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      
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
      {/* Notess */}
        <div className={styles.identityRow}>
        <div className={styles.nameCol}></div>

          <label className={styles.label}>
            Notes
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional details about this Event Reminders"
            />
          </label>
        </div>
      

 {/* Friends */}
      <div className={styles.row}>
        <label className={styles.label}>Friends</label>
        <div className={styles.controlRight}>
          <FriendSelector value={form.friends} onChange={handleFriendSelectorChange} />
        </div>
      </div>


      {/* Recurring toggle */}
      <div className={styles.row}>
      <RecurringToggle
        value={typeof form.recurring === 'object' ? form.recurring : { enabled: !!form.recurring && form.recurring !== 'never', interval: form.recurring && form.recurring !== 'never' ? form.recurring : 'yearly' }}
        onChange={(val) => {
         
          update('recurring', val.enabled ? val.interval : 'never');
        }}
        disabled={submitting}
      />
      </div>
      

     
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
