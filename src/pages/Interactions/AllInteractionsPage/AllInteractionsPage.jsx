import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInteractions } from "../../../utilities/interaction-api";
import InteractionList from "../../../components/Interactions/InteractionList/InteractionList";
import styles from "./AllInteractionsPage.module.scss";

export default function AllInteractionsPage() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "#b42318" }}>{err}</p>;

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1>Interactions</h1>
        <button onClick={() => nav("/interactions/new")}>+ Add Interaction</button>
      </header>
      <InteractionList interactions={items} />
    </section>
  );
}
