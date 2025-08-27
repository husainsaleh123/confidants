import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InteractionForm from "../../../components/Interactions/InteractionForm/InteractionForm";
import { getInteraction, updateInteraction } from "../../../utilities/interaction-api";
import styles from "./EditInteractionPage.module.scss";






export default function EditInteractionPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        const doc = await getInteraction(id);
        if (live) setData(doc || null);
      } catch (e) {
        if (live) setErr(e?.message || "Failed to load interaction");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => (live = false);
  }, [id]);

  async function handleSave(payload) {
    await updateInteraction(id, payload);
    nav(`/interactions/${id}`);
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "#b42318" }}>{err}</p>;
  if (!data) return <p>Interaction not found.</p>;

  return (
    <section>
      <InteractionForm
        heading="Edit Interaction"
        submitLabel="Update Interaction"
        initialData={data}
        onSubmit={handleSave}
      />
    </section>
  );
}
