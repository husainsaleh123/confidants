import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteInteraction,
  getInteraction,
} from "../../../utilities/interaction-api";
import InteractionCard from "../../../components/Interactions/InteractionCard/InteractionCard";
import styles from "./ShowInteractionPage.module.scss";

export default function ShowInteractionPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getInteraction(id);
        if (live) setDoc(data || null);
      } catch (e) {
        if (live) setErr(e?.message || "Failed to load interaction");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [id]);

  const item = useMemo(() => {
    if (!doc) return null;

    const friends = (doc.friendsInvolved || []).map((f) => ({
      _id: f?._id || String(f),
      name: f?.name || "Friend",
    }));

    const friendNames = friends.map((f) => f.name).filter(Boolean);
    const titleFromType =
      doc?.type && friendNames.length
        ? `${doc.type} — ${friendNames.join(", ")}`
        : doc?.type || "Interaction";

    return {
      _id: doc._id,
      name: (doc?.notes && doc.notes.trim().split("\n")[0]) || titleFromType,
      date: doc.date,
      description: doc.notes || "",
      friends,
      favourite: !!doc?.favourite,
    };
  }, [doc]);

  // Accept optional id so the card can call onDelete(_id)
  async function handleDelete(targetId = id) {
    try {
      await deleteInteraction(targetId);
      nav("/interactions");
      window.location.reload();
    } catch (e) {
      console.error(e);
      setErr("Failed to delete interaction.");
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "#b42318" }}>{err}</p>;
  if (!item) return <p>Interaction not found.</p>;

  return (
    <section className={styles.page}>
      {/* Optional top bar (styled in your .module.scss) */}
      {/* <header className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => nav("/interactions")}>
          ← Back
        </button>
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => nav(`/interactions/${id}/edit`)}
          >
            Edit
          </button>
          <button className={styles.deleteBtn} onClick={() => handleDelete()}>
            Delete
          </button>
        </div>
      </header> */}

      {/* Card now receives onDelete so its Delete button actually removes it */}
      <InteractionCard item={item} onDelete={handleDelete} />
    </section>
  );
}
