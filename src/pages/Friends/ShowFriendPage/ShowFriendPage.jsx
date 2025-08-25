import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./ShowFriendPage.module.scss";
import { getFriend, deleteFriend } from "../../../utilities/friends-api";
import FriendDetails from "../../../components/Friends/FriendDetails/FriendDetails";

export default function ShowFriendPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFriend(id);
        if (mounted) {
          setFriend(data);
          setError("");
        }
      } catch (e) {
        setError(e?.message || "Failed to load friend.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  async function handleRemove() {
    try {
      await deleteFriend(id);
      navigate("/friends"); // back to AllFriendsPage after deletion
    } catch (e) {
      setError(e?.message || "Failed to remove friend.");
    }
  }

  return (
    <section className={styles.page}>
      {/* Header actions */}
      <div className={styles.actionsBar}>
        <Link to="/friends" className={styles.backBtn}>← Back</Link>
        <div className={styles.spacer} />
        <div className={styles.rightActions}>
          <Link to={`/friends/${id}/edit`} className={styles.editBtn}>Edit friend</Link>
          <button type="button" className={styles.removeBtn} onClick={handleRemove}>
            Remove friend
          </button>
        </div>
      </div>

      {loading && <p className={styles.muted}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && friend && (
        <FriendDetails friend={friend} />
      )}
    </section>
  );
}
