import styles from "./FriendCard.module.scss";

/**
 * FriendCard
 * Shows: name, nickName, birthday, tags, likes, dislikes, neutral, lastContactDate.
 * Optional: avatarUrl (not in model; safe to omit or pass when available).
 */
export default function FriendCard({ friend }) {
  const {
    name,
    nickName,
    birthday,
    tags = [],
    likes = [],
    dislikes = [],
    neutral = [],
    lastContactDate,
    avatarUrl,
  } = friend || {};

  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : "—");

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name}'s avatar`} />
          ) : (
            <div className={styles.placeholder} aria-hidden />
          )}
        </div>
        <div className={styles.ident}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.nick}>@{nickName}</p>
        </div>
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Birthday</dt>
          <dd>{fmt(birthday)}</dd>
        </div>
        <div>
          <dt>Last Contact</dt>
          <dd>{fmt(lastContactDate)}</dd>
        </div>
      </dl>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Tags</span>
          <div className={styles.chips}>
            {tags.length ? tags.map((t) => <span key={t} className={styles.chip}>{t}</span>) : <span className={styles.empty}>—</span>}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Likes</span>
          <div className={styles.chips}>
            {likes.length ? likes.map((t, i) => <span key={`${t}-${i}`} className={styles.chip}>{t}</span>) : <span className={styles.empty}>—</span>}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Dislikes</span>
          <div className={styles.chips}>
            {dislikes.length ? dislikes.map((t, i) => <span key={`${t}-${i}`} className={styles.chip}>{t}</span>) : <span className={styles.empty}>—</span>}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Neutral</span>
          <div className={styles.chips}>
            {neutral.length ? neutral.map((t, i) => <span key={`${t}-${i}`} className={styles.chip}>{t}</span>) : <span className={styles.empty}>—</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
