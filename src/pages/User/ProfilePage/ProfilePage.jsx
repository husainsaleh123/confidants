import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.scss";

export default function ProfilePage({ user }) {
  const userId = user?._id || user?.id;
  const name = user?.name || "User";
  const email = user?.email || "";
  const avatarRaw = user?.profilePic || user?.avatar || "";

  // Normalize avatar in dev: support absolute URLs and /uploads served by backend on :3000
  const normalizeAvatar = (raw) => {
    const u = String(raw || "").trim().replace(/\\/g, "/");
    if (!u) return "";
    if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
    const looksLikeUploads =
      u.startsWith("uploads/") ||
      u.startsWith("/uploads/") ||
      u.startsWith("public/uploads/") ||
      u.startsWith("/public/uploads/");
    if (looksLikeUploads) {
      const withSlash = u.startsWith("/") ? u : `/${u}`;
      return `${window.location.protocol}//${window.location.hostname}:3000${withSlash}`;
    }
    return u.startsWith("/") ? u : `/${u}`;
  };

  const avatarUrl = normalizeAvatar(avatarRaw);

  return (
    <section className={styles.profilePage}>
      <h1 className={styles.pageTitle}>
        Welcome to your profile page, {name.split(" ")[0]}!
      </h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name}'s avatar`} />
          ) : (
            <div className={styles.avatarPlaceholder} aria-label="avatar placeholder" />
          )}
        </div>

        <div className={styles.info}>
          <h2>{name}</h2>
          {email && <p>{email}</p>}
        </div>

        <div className={styles.actions}>
          <Link to="/friends">
            <button type="button" className={`${styles.btn} ${styles.friendsBtn}`}>
              Friends
            </button>
          </Link>

          {userId ? (
            <Link to={`/profile/${userId}/edit`}>
              <button type="button" className={`${styles.btn} ${styles.editBtn}`}>
                Edit
              </button>
            </Link>
          ) : (
            <button type="button" className={styles.btn} disabled>
              Edit
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
