import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInteractions } from "../../../utilities/interaction-api";
import InteractionList from "../../../components/Interactions/InteractionList/InteractionList";
import styles from "./AllInteractionsPage.module.scss";

export default function AllInteractionsPage() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // UI state for filter/search (to match wireframe)
  const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'oldest'
  const [query, setQuery] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getInteractions();
        if (live) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (live) setErr(e?.message || "Failed to load interactions");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => (live = false);
  }, []);

  const filtered = useMemo(() => {
    let list = Array.isArray(items) ? [...items] : [];

    // search by notes/title/friends names
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((ix) => {
        const name =
          (ix?.notes && ix.notes.split("\n")[0]) ||
          ix?.type ||
          "";
        const text = [
          name,
          ix?.notes || "",
          ...(ix?.friendsInvolved || []).map((f) => f?.name || ""),
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      });
    }

    // sort
    list.sort((a, b) => {
      const da = a?.date ? new Date(a.date).getTime() : 0;
      const db = b?.date ? new Date(b.date).getTime() : 0;
      return sortBy === "latest" ? db - da : da - db;
    });

    return list;
  }, [items, query, sortBy]);

  if (loading) return <p className={styles.muted}>Loading…</p>;
  if (err) return <p className={styles.error}>{err}</p>;

  return (
    <section className={styles.page}>
      {/* top bar: count + add button */}
      <div className={styles.topbar}>
        <p className={styles.count}>
          You have logged <strong>{filtered.length || items.length}</strong> interactions!
        </p>
        <button
          className={styles.addBtn}
          onClick={() => nav("/interactions/new")}
        >
          + Add Interaction
        </button>
      </div>

      {/* controls: filter + search (exactly like the wireframe) */}
      <div className={styles.controls}>
        <div className={styles.filterWrap}>
          <span className={styles.filterLabel}>Filter by</span>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort interactions"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search interaction..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search interactions"
          />
          <button
            type="button"
            className={styles.searchBtn}
            onClick={() => setQuery((q) => q)}
            title="Search"
          >
            Search 🔎
          </button>
        </div>
      </div>

      <InteractionList interactions={filtered} />
    </section>
  );
}
