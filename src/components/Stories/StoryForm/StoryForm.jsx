import { useState } from "react";
import styles from "./StoryForm.module.scss";
import PhotoUploader from "../PhotoUploader/PhotoUploader";
import FriendSelector from "../FriendSelector/FriendSelector";
import MoodSelector from "../MoodSelector/MoodSelector";
import { getToken } from "../../../utilities/users-service";

// Universal moods normalizer: accepts strings, CSV, arrays, or objects ({value,label,name,mood})
function normalizeMoods(input) {
  if (input == null) return [];
  const arr = Array.isArray(input) ? input : [input];

  const parts = arr.flatMap((item) => {
    if (item == null) return [];
    if (typeof item === "string") return item.split(",");
    if (typeof item === "object") {
      const raw = item.value ?? item.label ?? item.name ?? item.mood ?? "";
      return String(raw).split(",");
    }
    return [String(item)];
  });

  // trim, filter, dedupe
  const clean = parts.map((s) => String(s).trim()).filter(Boolean);
  return Array.from(new Set(clean));
}

export default function StoryForm({
  initialData = {},
  heading = "Edit Confidants Cinema Hangout",
  submitLabel = "Add story",
  onSubmit,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || initialData.content || "");
  const [friends, setFriends] = useState(
    Array.isArray(initialData.friends) ? initialData.friends : (initialData.friendsInvolved || [])
  );
  const [moods, setMoods] = useState(normalizeMoods(initialData.moods ?? initialData.mood));
  const [files, setFiles] = useState(initialData.media || initialData.photos || []);
  const [dateStr, setDateStr] = useState(
    initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    const token = getToken();
    const res = await fetch("/api/friends", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load friends");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Normalize right before submit to guarantee a clean string[]
      const cleanMoods = normalizeMoods(moods);
      const hasFiles =
        Array.isArray(files) && files.length > 0 && files.some((f) => f instanceof File);

      if (hasFiles) {
        // Send as multipart; append array-friendly names
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        friends.forEach((id) => fd.append("friends[]", id));
        cleanMoods.forEach((m) => fd.append("moods[]", m));
        // Keep single mood mirror for older paths
        fd.append("mood", cleanMoods[0] || "");
        fd.append("date", dateStr || "");
        files.forEach((file) => fd.append("media", file));
        await onSubmit?.(fd);
      } else {
        // Send as JSON-like object
        await onSubmit?.({
          title,
          description,
          friends,
          moods: cleanMoods,
          mood: cleanMoods[0] || "",
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
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {/* Add media */}
          <div className={styles.row}>
            <label className={styles.label}>Add media</label>
            <div className={styles.controlRight}>
              <PhotoUploader files={files} onChange={setFiles} className={styles.linkBtn} />
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

          {/* Date */}
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
              <FriendSelector value={friends} onChange={setFriends} fetchFriends={fetchFriends} />
            </div>
          </div>

          {/* Moods (multi-select) */}
          <div className={styles.row}>
            <label className={styles.label}>Select moods</label>
            <div className={styles.controlRight}>
              {/* Normalize on change to keep state clean */}
              <MoodSelector value={moods} onChange={(vals) => setMoods(normalizeMoods(vals))} />
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
