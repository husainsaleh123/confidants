import { useEffect, useMemo, useState } from "react";
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
  const [q, setQ] = useState("");                // name/nick search
  const [tag, setTag] = useState("");            // selected tag
  const [sentiment, setSentiment] = useState(""); // "", "likes", "dislikes", "neutral"

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
      // name or nickname match
      const nameMatch = rgx ? (rgx.test(f.name) || rgx.test(f.nickName)) : true;

      // tag match
      const tagMatch = tag ? (Array.isArray(f.tags) && f.tags.includes(tag)) : true;

      // sentiment match
      let sentimentMatch = true;
      if (sentiment === "likes") sentimentMatch = (f.likes || []).length > 0;
      if (sentiment === "dislikes") sentimentMatch = (f.dislikes || []).length > 0;
      if (sentiment === "neutral") sentimentMatch = (f.neutral || []).length > 0;

      return nameMatch && tagMatch && sentimentMatch;
    });
  }, [friends, q, tag, sentiment]);

  return (
    <section className={styles.page}>
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
          <TagList
            tags={allTags}
            value={tag}
            onChange={setTag}
            className={styles.tags}
          />
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
