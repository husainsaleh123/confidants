// src/pages/Stories/AddStoryPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import StoryForm from "../../../components/Stories/StoryForm/StoryForm";
import { createStory } from "../../../utilities/stories-api";
import styles from "./AddStoryPage.module.scss";

export default function AddStoryPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    return String(v).split(",").map((s) => s.trim()).filter(Boolean);
  };

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
        payload = {
          title: getFromFD(form, "title"),
          content: getFromFD(form, "description"),
          mood: getFromFD(form, "mood"),
          visibility: "private",
          date: new Date().toISOString(),
          friendsInvolved: getAllFromFD(form, "friends[]"),
          photos: toArray(getFromFD(form, "mediaUrls")),
        };
      } else {
        payload = {
          title: form.title || "",
          content: form.description || "",
          mood: form.mood || "",
          visibility: "private",
          date: new Date().toISOString(),
          friendsInvolved: toArray(form.friends),
          photos: toArray(form.media),
        };
      }

      const created = await createStory(payload);
      const newStory = created?.story ?? created?.data ?? created ?? null;

      if (newStory && !newStory.createdAt) {
        newStory.createdAt = new Date().toISOString();
      }

      // ✅ Stash in extras list so AllStoriesPage can show it even after refresh
      if (newStory && idOf(newStory)) {
        const extras = readJSON("stories:extras", []);
        const exists = extras.some((s) => String(idOf(s)) === String(idOf(newStory)));
        const next = exists ? extras : [newStory, ...extras];
        writeJSON("stories:extras", next);
        // keep last seen too (handy for debugging)
        writeJSON("stories:lastNew", newStory);
      }

      // Back to list with state for instant render
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
        <h1 className={styles.title}>Add a new story, share a new memory.</h1>
        <Link to="/stories" className={styles.backBtn}>
          ← Back to all stories
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
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
