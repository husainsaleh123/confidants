import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StoryForm from "../../../components/Stories/StoryForm/StoryForm";
import { createStory } from "../../../utilities/stories-api";

export default function AddStoryPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // utils
  const toArray = (v) =>
    Array.isArray(v)
      ? v
      : v == null || v === ""
      ? []
      : String(v).split(",").map((s) => s.trim()).filter(Boolean);

  const idOf = (s) => s?._id || s?.id;

  const readJSON = (k, fallback) => {
    if (typeof window === "undefined") return fallback;
    try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  };
  const writeJSON = (k, v) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  };

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      const getFromFD = (fd, key) => (fd.get(key) ?? "").toString();
      const getAllFromFD = (fd, key) => fd.getAll(key).map(String);

      let payload;

      if (typeof FormData !== "undefined" && form instanceof FormData) {
        const moodStr = getFromFD(form, "mood");
        const dateStr = getFromFD(form, "date"); // "YYYY-MM-DD" from form
        const chosenDateISO = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

        payload = {
          title: getFromFD(form, "title"),
          content: getFromFD(form, "description"),
          mood: moodStr,
          moods: moodStr ? [moodStr] : [],
          visibility: "private",
          date: chosenDateISO,                 // <-- user-chosen story date
          friendsInvolved: getAllFromFD(form, "friends[]"),
          photos: toArray(getFromFD(form, "mediaUrls")),
        };
      } else {
        const moodStr = (form.mood || "").toString().trim();
        const dateStr = (form.date || "").toString().trim(); // "YYYY-MM-DD" or ""
        const chosenDateISO = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

        payload = {
          title: form.title || "",
          content: form.description || "",
          mood: moodStr,
          moods: moodStr ? [moodStr] : [],
          visibility: "private",
          date: chosenDateISO,                 // <-- user-chosen story date
          friendsInvolved: toArray(form.friends),
          photos: toArray(form.media),
        };
      }

      const created = await createStory(payload);
      const newStory = created?.story ?? created?.data ?? created ?? null;

      if (newStory && !newStory.createdAt) {
        newStory.createdAt = new Date().toISOString();
      }

      // cache so list shows immediately and survives refresh
      if (newStory && idOf(newStory)) {
        const extras = readJSON("stories:extras", []);
        const exists = extras.some((s) => String(idOf(s)) === String(idOf(newStory)));
        const next = exists ? extras : [newStory, ...extras];
        writeJSON("stories:extras", next);
        writeJSON("stories:lastNew", newStory);
      }

      navigate("/stories", { state: { newStory } });
    } catch (e) {
      setError(e?.message || "Failed to add story.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div>
        <h1>Add a new story, share a new memory.</h1>
        <Link to="/stories">← Back to all stories</Link>
      </div>

      {error && <p>{error}</p>}

      <div>
        <StoryForm
          initialData={{}}
          heading="Add a new story, share a new memory."
          submitLabel={submitting ? "Saving..." : "Add story"}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}