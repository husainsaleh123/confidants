import styles from "./InteractionList.module.scss";
import InteractionCard from "../Interactions/InteractionCard/InteractionCard";

/** Normalize a DB doc → InteractionCard shape (only if needed) */
function toCardItem(ix) {
  if (!ix) return ix;
  // If it's already shaped for InteractionCard, return as-is
  if (ix.name || ix.description || ix.friends) return ix;

  const friends = (ix.friendsInvolved || []).map((f) => ({
    _id: f?._id || String(f),
    name: f?.name || "Friend",
  }));

  const friendNames = friends.map((f) => f.name).filter(Boolean);
  const titleFromType =
    ix?.type && friendNames.length
      ? `${ix.type} — ${friendNames.join(", ")}`
      : ix?.type || "Interaction";

  return {
    _id: ix?._id,
    name: (ix?.notes && ix.notes.trim().split("\n")[0]) || titleFromType,
    date: ix?.date,
    description: ix?.notes || "",
    friends,
    favourite: !!ix?.favourite,
  };
}

/**
 * InteractionList
 * - Presentational: renders a stack/grid of InteractionCard
 * - Accepts either raw DB docs or pre-shaped items
 */
export default function InteractionList({ interactions = [] }) {
  if (!interactions?.length) {
    return <p className={styles.empty}>No interactions match your filters.</p>;
  }
  return (
    <div className={styles.grid}>
      {interactions.map((ix) => (
        <InteractionCard key={ix._id} item={toCardItem(ix)} />
      ))}
    </div>
  );
}
