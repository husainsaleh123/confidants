import { useState } from "react";
import styles from "./StoryForm.module.scss";
import PhotoUploader from "../PhotoUploader/PhotoUploader";
import FriendSelector from "../FriendSelector/FriendSelector";
import MoodSelector from "../MoodSelector/MoodSelector";

export default function StoryForm({
  initialData = {},
  heading = "Edit Confidants Cinema Hangout",
  submitLabel = "Add story",
  onSubmit,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [eventName, setEventName] = useState(initialData.eventName || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [friends, setFriends] = useState(initialData.friends || []);
  const [mood, setMood] = useState(initialData.mood || "");
  const [files, setFiles] = useState(initialData.media || []);
  // NEW: story date (YYYY-MM-DD). If you have initialData.date, prefill it.
  const initialDateStr =
    initialData.date
      ? new Date(initialData.date).toISOString().slice(0, 10)
      : "";
  const [dateStr, setDateStr] = useState(initialDateStr);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const hasFiles =
        Array.isArray(files) && files.length > 0 && files.some((f) => f instanceof File);

      if (hasFiles) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("eventName", eventName);
        fd.append("description", description);
        friends.forEach((id) => fd.append("friends[]", id));
        fd.append("mood", mood);
        // NEW: forward date as plain string "YYYY-MM-DD"
        fd.append("date", dateStr || "");
        files.forEach((file) => fd.append("media", file));
        await onSubmit?.(fd);
      } else {
        await onSubmit?.({
          title,
          eventName,
          description,
          friends,
          mood,
          // NEW: pass date string (the page will convert to ISO)
          date: dateStr || "",
          media: files,
        });
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>{heading}</h2>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
          {/* Add media */}
          <div className={styles.row}>
            <label className={styles.label}>Add media</label>
            <div className={styles.controlRight}>
              <PhotoUploader files={files} onChange={setFiles} />
            </div>
          </div>

          {/* Title */}
          <div className={styles.row}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Event */}
          <div className={styles.row}>
            <label className={styles.label}>Event</label>
            <input
              className={styles.input}
              type="text"
              name="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          {/* NEW: Date (user-chosen story date) */}
          <div className={styles.row}>
            <label className={styles.label}>Date</label>
            <input
              className={styles.input}
              type="date"
              name="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className={styles.row}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Friends */}
          <div className={styles.row}>
            <label className={styles.label}>Select friends</label>
            <div className={styles.controlRight}>
              <FriendSelector value={friends} onChange={setFriends} />
            </div>
          </div>

          {/* Mood */}
          <div className={styles.row}>
            <label className={styles.label}>Select mood</label>
            <div className={styles.controlRight}>
              <MoodSelector value={mood} onChange={setMood} />
            </div>
          </div>

          {/* Submit */}
          <div className={styles.actions}>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
