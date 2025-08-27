import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StoryForm from "../../../components/Stories/StoryForm/StoryForm";
import { createStory } from "../../../utilities/stories-api";
import styles from "./AddStoryPage.module.scss";

export default function AddStoryPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toArray = (v) =>
    Array.isArray(v) ? v : v == null || v === "" ? [] : String(v).split(",").map((s) => s.trim()).filter(Boolean);

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
        const moodsArr = getAllFromFD(form, "moods[]");
        const dateStr = getFromFD(form, "date");
        payload = {
          title: getFromFD(form, "title"),
          content: getFromFD(form, "description"),
          mood: moodsArr[0] || "",
          moods: moodsArr,
          visibility: "private",
          date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
          friendsInvolved: getAllFromFD(form, "friends[]"),
          photos: toArray(getFromFD(form, "mediaUrls")),
        };
      } else {
        const moodsArr = toArray(form.moods);
        const dateStr = (form.date || "").toString().trim();
        payload = {
          title: form.title || "",
          content: form.description || "",
          mood: (moodsArr[0] || "").toString(),
          moods: moodsArr,
          visibility: "private",
          date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
          friendsInvolved: toArray(form.friends),
          photos: toArray(form.media),
        };
      }

      const created = await createStory(payload);
      const newStory = created?.story ?? created?.data ?? created ?? null;

      if (newStory && !newStory.createdAt) {
        newStory.createdAt = new Date().toISOString();
      }

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
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <Link to="/stories" className={styles.backLink}>← Back to all stories</Link>
        <h1 className={styles.title}>Add a new story, share a new memory.</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formWrap}>
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
