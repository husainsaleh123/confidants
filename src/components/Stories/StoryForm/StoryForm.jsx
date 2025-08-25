import { useState } from "react";
import styles from "./StoryForm.module.scss";
import PhotoUploader from "./PhotoUploader";
import FriendSelector from "./FriendSelector";
import MoodSelector from "./MoodSelector";

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
        files.forEach((file) => fd.append("media", file)); // backend should accept multiple

        await onSubmit?.(fd);
      } else {
        await onSubmit?.({
          title,
          eventName,
          description,
          friends,
          mood,
          media: files, // might be existing URLs
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
          {/* Add media row */}
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
