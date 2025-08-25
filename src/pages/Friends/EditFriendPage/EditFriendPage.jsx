import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./EditFriendPage.module.scss";

import { getFriend, updateFriend } from "../../../utilities/friends-api";
import FriendForm from "../../../components/Friends/FriendForm/FriendForm";

export default function EditFriendPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing friend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFriend(id);
        if (mounted) setFriend(data);
      } catch (e) {
        setError(e?.message || "Failed to load friend.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Prepare initial values for the form (comma-separated strings for chips-like inputs)
  const initial = useMemo(() => {
    if (!friend) return null;
    const join = (arr) => Array.isArray(arr) ? arr.join(", ") : "";
    return {
      avatarUrl: friend.avatarUrl || "",
      name: friend.name || "",
      nickName: friend.nickName || "",
      birthday: friend.birthday ? friend.birthday.slice(0, 10) : "",
      lastContactDate: friend.lastContactDate ? friend.lastContactDate.slice(0, 10) : "",
      tags: join(friend.tags),
      likes: join(friend.likes),
      dislikes: join(friend.dislikes),
      neutral: join(friend.neutral),
    };
  }, [friend]);

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

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

      const updated = await updateFriend(id, payload); // PUT /api/friends/:id
      // (Your backend’s update handler fields match exactly these keys.) 
      if (updated && updated._id) navigate(`/friends/${updated._id}`);
      else navigate(`/friends/${id}`);
    } catch (e) {
      setError(e?.message || "Failed to save changes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          {friend ? `Edit ${friend.name}` : "Edit friend"}
        </h1>
        <Link to={`/friends/${id}`} className={styles.backBtn}>
          ← Back
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.muted}>Loading…</p>}

      {!loading && friend && (
        <div className={styles.card}>
          {/* Reuse the same FriendForm as AddFriendPage */}
          <FriendForm
            initial={initial}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitText="Save changes"
          />
        </div>
      )}
    </section>
  );
}
