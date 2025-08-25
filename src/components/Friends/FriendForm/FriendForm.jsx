import { useState } from "react";
import styles from "./FriendForm.module.scss";

/**
 * FriendForm
 * One-page form (prototype shown in multiple screenshots).
 * Fields: avatarUrl, name, nickName, birthday, tags, likes, dislikes, neutral, lastContactDate
 */
export default function FriendForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    avatarUrl: "",
    name: "",
    nickName: "",
    birthday: "",
    tags: "",
    likes: "",
    dislikes: "",
    neutral: "",
    lastContactDate: "",
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
      {/* Top row: avatar preview + main identity */}
      <div className={styles.identityRow}>
        <div className={styles.avatarCol}>
          <div className={styles.avatar}>
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Avatar preview" />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
          </div>
          <input
            type="url"
            className={styles.input}
            placeholder="Avatar URL (optional)"
            value={form.avatarUrl}
            onChange={(e) => update("avatarUrl", e.target.value)}
          />
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

      {/* Multi-line chips inputs (comma separated) */}
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
          {submitting ? "Adding…" : "Add friend"}
        </button>
      </div>
    </form>
  );
}
