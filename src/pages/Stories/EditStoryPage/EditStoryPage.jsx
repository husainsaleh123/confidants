import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import StoryForm from "../../../components/Stories/StoryForm/StoryForm";
import styles from "./EditStoryPage.module.scss";
import { updateStory } from "../../../utilities/stories-api";
import { getToken } from "../../../utilities/users-service";

export default function EditStoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const idOf = (s) => s?._id || s?.id;

  // helpers for localStorage
  const readJSON = (k, fallback) => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const writeJSON = (k, v) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  };

  const toArray = (v) =>
    Array.isArray(v)
      ? v
      : v == null || v === ""
      ? []
      : String(v).split(",").map((s) => s.trim()).filter(Boolean);

  const normalizeMoodsOnStory = (s) => {
    const raw = Array.isArray(s?.moods)
      ? s.moods
      : s?.moods
      ? toArray(s.moods)
      : s?.mood
      ? [s.mood]
      : [];
    const cleaned = raw.map(String).filter(Boolean);
    return { ...s, moods: cleaned, mood: cleaned[0] || s?.mood || "" };
  };

  // initial story: prefer router state; else check caches; else fetch
  const [story, setStory] = useState(() =>
    location.state?.story ? normalizeMoodsOnStory(location.state.story) : null
  );
  const [loading, setLoading] = useState(!story);
  const [error, setError] = useState("");

  useEffect(() => {
    if (story) return;

    let active = true;

    async function load() {
      try {
        // 1) try caches
        const extras = readJSON("stories:extras", []);
        const snapshot = readJSON("stories:lastSnapshot", []);
        const lastNew = readJSON("stories:lastNew", null);
        const all = [...extras, ...snapshot, ...(lastNew ? [lastNew] : [])];
        const found = all.find((s) => String(idOf(s)) === String(id));
        if (found && active) {
          setStory(normalizeMoodsOnStory(found));
          setLoading(false);
          return;
        }

        // 2) fetch from API
        const token = getToken();
        const res = await fetch(`/api/stories/${encodeURIComponent(id)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: "include",
        });
        if (!active) return;

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP ${res.status}`);
        }
        const json = await res.json();
        const raw = json?.story ?? json?.data ?? json ?? {};
        setStory(normalizeMoodsOnStory(raw));
      } catch (e) {
        setError(e?.message || "Failed to load story.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [id, story]);

  const pageTitle = useMemo(
    () => (story?.title ? `Edit: ${story.title}` : "Edit story"),
    [story]
  );

  async function handleSubmit(form) {
    try {
      setError("");

      const getFromFD = (fd, key) => (fd.get(key) ?? "").toString();
      const getAllFromFD = (fd, key) => fd.getAll(key).map(String);

      let payload;

      if (typeof FormData !== "undefined" && form instanceof FormData) {
        // Accept both moods[] and moods
        const moodsArr = [
          ...getAllFromFD(form, "moods[]"),
          ...getAllFromFD(form, "moods"),
        ].filter(Boolean);

        const dateStr = getFromFD(form, "date");

        payload = {
          title: getFromFD(form, "title"),
          content: getFromFD(form, "description"),
          mood: moodsArr[0] || "",
          moods: moodsArr,
          date: dateStr ? new Date(dateStr).toISOString() : undefined,
          friendsInvolved: [
            ...getAllFromFD(form, "friends[]"),
            ...getAllFromFD(form, "friends"),
          ],
          // media is handled elsewhere in your app; we pass through URLs if present
          photos: toArray(getFromFD(form, "mediaUrls")),
          visibility: story?.visibility || "private",
        };
      } else {
        const moodsArr = Array.isArray(form.moods) ? form.moods : toArray(form.moods);
        const dateStr = (form.date || "").toString().trim();

        payload = {
          title: form.title || "",
          content: form.description || "",
          mood: (moodsArr[0] || "").toString(),
          moods: moodsArr,
          date: dateStr ? new Date(dateStr).toISOString() : undefined,
          friendsInvolved: Array.isArray(form.friends) ? form.friends : toArray(form.friends),
          photos: Array.isArray(form.media) ? form.media : toArray(form.media),
          visibility: story?.visibility || "private",
        };
      }

      // Call API
      const updated = await updateStory(idOf(story) || id, payload);
      const raw = updated?.story ?? updated?.data ?? updated ?? null;

      // Normalize server response
      let newStory = raw ? normalizeMoodsOnStory(raw) : null;

      // Ensure we preserve full moods selected by the user even if API only echoes one
      const clientMoods = Array.isArray(payload?.moods) ? payload.moods : [];
      if (newStory && clientMoods.length) {
        newStory = {
          ...newStory,
          moods: [...new Set(clientMoods.map(String).filter(Boolean))],
          mood: (clientMoods[0] || newStory.mood || "").toString(),
        };
      }

      // Keep createdAt if server didn't send it back
      if (newStory && !newStory.createdAt && story?.createdAt) {
        newStory.createdAt = story.createdAt;
      }

      // Update local caches so Show page reflects all moods immediately
      if (newStory && idOf(newStory)) {
        const sid = String(idOf(newStory));
        const extras = readJSON("stories:extras", []);
        const next = [newStory, ...extras.filter((s) => String(idOf(s)) !== sid)];
        writeJSON("stories:extras", next);
        writeJSON("stories:lastSnapshot", next); // optional: keep snapshot aligned
      }

      navigate(`/stories/${encodeURIComponent(idOf(newStory) || id)}`, {
        state: { story: newStory },
      });
    } catch (e) {
      setError(e?.message || "Failed to update story.");
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.header}>
          <Link to="/stories" className={styles.backLink}>← Back to all stories</Link>
        </div>
        <p>Loading…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <div className={styles.header}>
          <Link to="/stories" className={styles.backLink}>← Back to all stories</Link>
        </div>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  if (!story) {
    return (
      <section className={styles.page}>
        <div className={styles.header}>
          <Link to="/stories" className={styles.backLink}>← Back to all stories</Link>
        </div>
        <p>Story not found.</p>
      </section>
    );
  }

  // Prepare initial data for StoryForm — it already normalizes moods internally,
  // but we pass the normalized story for consistency.
  const initialData = {
    title: story.title,
    description: story.content || story.description || "",
    friends: Array.isArray(story.friendsInvolved) ? story.friendsInvolved : [],
    moods: Array.isArray(story.moods) ? story.moods : toArray(story.moods || story.mood),
    media: Array.isArray(story.photos) ? story.photos : [],
    date: story.date,
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <Link to="/stories" className={styles.backLink}>← Back to all stories</Link>
        {/* <h1 className={styles.title}>{pageTitle}</h1> */}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formShell}>
        <StoryForm
          initialData={initialData}
          heading={pageTitle}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
