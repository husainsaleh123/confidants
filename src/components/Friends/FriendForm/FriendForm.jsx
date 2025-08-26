import { useEffect, useState } from "react";
import styles from "./FriendForm.module.scss";

/**
 * FriendForm
 * Props:
 * - initial?: object with field defaults (for edit mode)
 * - submitText?: string (button label)
 * - submitting?: boolean
 * - onSubmit(form): callback
 */
export default function FriendForm({ initial, submitText = "Add friend", submitting, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    nickName: "",
    birthday: "",
    tags: "",
    likes: "",
    dislikes: "",
    neutral: "",
    lastContactDate: "",
  });

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.identityRow}>
        <div className={styles.avatarCol}>
          <div className={styles.avatar}>
            
          </div>
          
        </div>

        <div className={styles.nameCol}>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Ahmed Alshaikh"
            />
          </label>

          <label className={styles.label}>
            Nickname
            <input
              className={styles.input}
              type="text"
              required
              value={form.nickName}
              onChange={(e) => update("nickName", e.target.value)}
              placeholder="e.g., Ahmed"
            />
          </label>

          <label className={styles.labelInline}>
            <span>Birthday</span>
            <input
              className={styles.input}
              type="date"
              required
              value={form.birthday}
              onChange={(e) => update("birthday", e.target.value)}
            />
          </label>

          <label className={styles.labelInline}>
            <span>Last contacted</span>
            <input
              className={styles.input}
              type="date"
              value={form.lastContactDate}
              onChange={(e) => update("lastContactDate", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className={styles.grid}>
        <label className={styles.label}>
          Tags
          <input
            className={styles.input}
            type="text"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="e.g., school, gym, football"
          />
          <p className={styles.hint}>Separate with commas</p>
        </label>

        <label className={styles.label}>
          Likes
          <input
            className={styles.input}
            type="text"
            value={form.likes}
            onChange={(e) => update("likes", e.target.value)}
            placeholder="e.g., sushi, Real Madrid, hiking"
          />
          <p className={styles.hint}>Separate with commas</p>
        </label>

        <label className={styles.label}>
          Dislikes
          <input
            className={styles.input}
            type="text"
            value={form.dislikes}
            onChange={(e) => update("dislikes", e.target.value)}
            placeholder="e.g., spicy food, loud cafes"
          />
          <p className={styles.hint}>Separate with commas</p>
        </label>

        <label className={styles.label}>
          Neutral
          <input
            className={styles.input}
            type="text"
            value={form.neutral}
            onChange={(e) => update("neutral", e.target.value)}
            placeholder="e.g., board games, documentaries"
          />
          <p className={styles.hint}>Separate with commas</p>
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.submitBtn} type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitText}
        </button>
      </div>
    </form>
  );
}
