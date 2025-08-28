import { useNavigate } from "react-router-dom";
import InteractionForm from "../../../components/Interactions/InteractionForm/InteractionForm";
import { createInteraction } from "../../../utilities/interaction-api";
import styles from "./AddInteractionPage.module.scss";


export default function AddInteractionPage() {
  const nav = useNavigate();

  async function handleCreate(payload) {
    const created = await createInteraction(payload);
    // After creating, go to Show page (or back to list if you prefer)
    if (created?._id) nav(`/interactions/${created._id}`);
    else nav("/interactions");
  }

  return (
    <section>
      <section className={styles.page}>
        <InteractionForm
          heading="Add Interaction"
          submitLabel="Add Interaction"
          onSubmit={handleCreate}
        />
      </section>
    </section>
  );
}
