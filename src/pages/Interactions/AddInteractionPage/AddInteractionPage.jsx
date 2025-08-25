import { useNavigate } from "react-router-dom";
import InteractionForm from "../../../components/interactions/InteractionForm";
import { createInteraction } from "../../../utilities/interactions-api";

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
      <InteractionForm
        heading="Add Interaction"
        submitLabel="Add Interaction"
        onSubmit={handleCreate}
      />
    </section>
  );
}
