// src/pages/AllFriendsPage/AllFriendsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AllFriendsPage.module.scss";
import { getUserFriends } from "../../../utilities/friends-api";
import SearchBar from "../../../components/Friends/SearchBar/SearchBar";
import TagList from "../../../components/Friends/TagList/TagList";
import FriendList from "../../../components/Friends/FriendList/FriendList";

export default function AllFriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [sentiment, setSentiment] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUserFriends();
        if (mounted) {
          setFriends(data || []);
          setError("");
        }
      } catch (e) {
        setError(e?.message || "Failed to load friends.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    friends.forEach(f => (f?.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [friends]);

  const filtered = useMemo(() => {
    const rgx = q ? new RegExp(q, "i") : null;
    return friends.filter(f => {
      const nameMatch = rgx ? (rgx.test(f.name) || rgx.test(f.nickName)) : true;
      const tagMatch = tag ? (Array.isArray(f.tags) && f.tags.includes(tag)) : true;
      let sentimentMatch = true;
      if (sentiment === "likes") sentimentMatch = (f.likes || []).length > 0;
      if (sentiment === "dislikes") sentimentMatch = (f.dislikes || []).length > 0;
      if (sentiment === "neutral") sentimentMatch = (f.neutral || []).length > 0;
      return nameMatch && tagMatch && sentimentMatch;
    });
  }, [friends, q, tag, sentiment]);

  return (
    <section className={styles.page}>
      {/* Top bar: count + Add friend */}
      <div className={styles.topbar}>
        <p className={styles.count}>You have <strong>{friends.length}</strong> friend{friends.length === 1 ? "" : "s"}!</p>
        <Link to="/friends/new" className={styles.addBtn}>
          + Add friend
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>All Friends</h1>
        <div className={styles.controls}>
          <SearchBar
            value={q}
            onChange={setQ}
            sentiment={sentiment}
            onSentimentChange={setSentiment}
            className={styles.search}
          />
          <div className={styles.filterWrap}>
            <span className={styles.filterLabel}>Filter by</span>
            <TagList
              tags={allTags}
              value={tag}
              onChange={setTag}
              className={styles.tags}
            />
          </div>
        </div>
      </header>

      {loading && <p className={styles.muted}>Loading…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <FriendList friends={filtered} />
      )}
    </section>
  );
}
