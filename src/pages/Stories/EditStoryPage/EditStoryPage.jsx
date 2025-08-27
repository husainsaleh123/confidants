// src/pages/Stories/EditStoryPage/EditStoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StoryForm from "../../../components/Stories/StoryForm/StoryForm";
import { getStory, updateStory } from "../../../utilities/stories-api";
import styles from "./EditStoryPage.module.scss";

export default function EditStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const idOf = (s) => s?._id || s?.id;

  const [story, setStory] = useState(() => location.state?.story || null);
  const [loading, setLoading] = useState(!story);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (story) { setLoading(false); return; }
        const readJSON = (k) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; } };
        const caches = [
          ...(readJSON("stories:extras") || []),
          ...(readJSON("stories:lastSnapshot") || []),
          ...(readJSON("stories:lastNew") ? [readJSON("stories:lastNew")] : []),
        ];
        const fromCache = caches.find((s) => String(idOf(s)) === String(id));
        if (fromCache && !cancelled) setStory(fromCache);

        setLoading(true);
        const s = await getStory(id);
        if (!cancelled) setStory(s?.story ?? s?.data ?? s ?? null);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load story.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, story]);

// inside useMemo
const initialData = useMemo(() => {
  if (!story) return {};
  return {
    title: story.title || "",
    description: story.content || "",
    friends: (story.friendsInvolved || []).map((f) => f?._id || f?.id || f).filter(Boolean),
    moods: Array.isArray(story.moods) ? story.moods : (story.mood ? [story.mood] : []),
    mood: story.mood || "",
    media: story.photos || [],
    date: story.date || "",
  };
}, [story]);


  async function handleSubmit(form) {
    try {
      setError("");

      const getFromFD = (fd, key) => (fd.get(key) ?? "").toString();
      const getAllFromFD = (fd, key) => fd.getAll(key).map(String);
      const toArray = (v) =>
        Array.isArray(v) ? v : v == null || v === "" ? [] : String(v).split(",").map((s) => s.trim()).filter(Boolean);

      let payload;

      if (typeof FormData !== "undefined" && form instanceof FormData) {
        const moodsArr = getAllFromFD(form, "moods[]");
        const dateStr = getFromFD(form, "date");
        payload = {
          title: getFromFD(form, "title"),
          content: getFromFD(form, "description"),
          mood: moodsArr[0] || "",
          moods: moodsArr,
          date: dateStr ? new Date(dateStr).toISOString() : story?.date || new Date().toISOString(),
          friendsInvolved: getAllFromFD(form, "friends[]"),
          photos: toArray(getFromFD(form, "mediaUrls")).length ? toArray(getFromFD(form, "mediaUrls")) : story?.photos || [],
          visibility: story?.visibility || "private",
        };
      } else {
        const moodsArr = toArray(form.moods);
        const dateStr = (form.date || "").toString().trim();
        payload = {
          title: form.title || "",
          content: form.description || "",
          mood: (moodsArr[0] || "").toString(),
          moods: moodsArr,
          date: dateStr ? new Date(dateStr).toISOString() : story?.date || new Date().toISOString(),
          friendsInvolved: toArray(form.friends),
          photos: toArray(form.media).length ? toArray(form.media) : story?.photos || [],
          visibility: story?.visibility || "private",
        };
      }

      const updated = await updateStory(id, payload);
      const updatedStory = updated?.story ?? updated?.data ?? updated ?? payload;
      updatedStory._id = idOf(updatedStory) || idOf(story) || id;
      if (!updatedStory.createdAt && story?.createdAt) updatedStory.createdAt = story.createdAt;

      const readJSON = (k, fb) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; } };
      const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
      const replaceIn = (arr) =>
        (arr || []).map((x) => (String(idOf(x)) === String(idOf(updatedStory)) ? { ...x, ...updatedStory } : x));

      writeJSON("stories:extras", replaceIn(readJSON("stories:extras", [])));
      writeJSON("stories:lastSnapshot", replaceIn(readJSON("stories:lastSnapshot", [])));
      writeJSON("stories:lastNew", updatedStory);

      navigate(`/stories/${id}`, { state: { story: updatedStory, justEdited: true } });
    } catch (e) {
      setError(e?.message || "Failed to update story.");
    }
  }

  if (loading) return <main><p>Loading…</p></main>;
  if (error) return (
    <main>
      <p>{error}</p>
      <p><Link to="/stories">← Back to all stories</Link></p>
    </main>
  );
  if (!story) return (
    <main>
      <p>Story not found.</p>
      <p><Link to="/stories">← Back to all stories</Link></p>
    </main>
  );

  return (
    <section className={styles.page}>
    <div className={styles.header}>
      <Link to={`/stories/${id}`} className={styles.backLink}>
        ← Back to story
      </Link>
    </div>

      <div>
        <StoryForm
          initialData={initialData}
          heading={`Edit ${story.title || "story"}`}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
