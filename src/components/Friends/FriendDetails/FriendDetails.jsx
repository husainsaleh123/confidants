import styles from "./FriendDetails.module.scss";

/**
 * FriendDetails
 * - Full profile view shown on ShowFriendPage
 * - Sections: identity, meta (birthday / last contact), tags, likes, dislikes, neutral, stories
 */
export default function FriendDetails({ friend }) {
  const {
    name,
    nickName,
    birthday,
    lastContactDate,
    tags = [],
    likes = [],
    dislikes = [],
    neutral = [],
    avatarUrl,
  } = friend || {};

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <article className={styles.wrap}>
      {/* Top identity block */}
      <header className={styles.header}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name}'s avatar`} />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>
        <div className={styles.ident}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.subline}>
            <span className={styles.nick}>@{nickName}</span>
          </p>
        </div>
        <div className={styles.dates}>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>Birthday</span>
            <span className={styles.dateVal}>{fmt(birthday)}</span>
          </div>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>Last contact</span>
            <span className={styles.dateVal}>{fmt(lastContactDate)}</span>
          </div>
        </div>
      </header>

      {/* Attribute sections */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tags</h2>
        <div className={styles.chips}>
          {tags.length ? (
            tags.map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Likes</h2>
        <div className={styles.chips}>
          {likes.length ? (
            likes.map((t, i) => (
              <span key={`${t}-${i}`} className={styles.chip}>
                {t}
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Dislikes</h2>
        <div className={styles.chips}>
          {dislikes.length ? (
            dislikes.map((t, i) => (
              <span key={`${t}-${i}`} className={styles.chip}>
                {t}
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Neutral</h2>
        <div className={styles.chips}>
          {neutral.length ? (
            neutral.map((t, i) => (
              <span key={`${t}-${i}`} className={styles.chip}>
                {t}
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stories</h2>
        <div className={styles.storiesEmpty}>No stories yet.</div>
      </section>
    </article>
  );
}
