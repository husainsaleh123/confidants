import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AddFriendPage.module.scss";
import FriendForm from "../../../components/Friends/FriendForm/FriendForm";
import { createFriend } from "../../../utilities/friends-api";

export default function AddFriendPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      // Convert comma-separated strings → arrays, trim empties
      const toArr = (v) =>
        String(v || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      const payload = {
        name: form.name,
        nickName: form.nickName,
        birthday: form.birthday || null,
        lastContactDate: form.lastContactDate || null,
        tags: toArr(form.tags),
        likes: toArr(form.likes),
        dislikes: toArr(form.dislikes),
        neutral: toArr(form.neutral),
    
      };

      const created = await createFriend(payload);
      // go to the newly created friend page if id exists, else back to list
      if (created && created._id) navigate(`/friends/${created._id}`);
      else navigate("/friends");
    } catch (e) {
      setError(e?.message || "Failed to add friend.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Add a new friend</h1>
        <Link to="/friends" className={styles.backBtn}>← Back to all friends</Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <FriendForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </section>
  );
}
