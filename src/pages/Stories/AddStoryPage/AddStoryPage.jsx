// src/pages/Stories/AddStoryPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryForm from "../../components/Stories/StoryForm";
import { createStory } from "../../utilities/stories-api";
import styles from "./AddStoryPage.module.scss";

export default function AddStoryPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Helper: coerce to array (works for string, array, undefined)
  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    // If a comma-separated string is there this will split/trim it.
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  async function handleSubmit(form) {
    try {
      setSubmitting(true);
      setError("");

      //safely get a single field from a FormData (or "" if missing) and turn it into a string.
      const getFromFD = (fd, key) => (fd.get(key) ?? "").toString();

      //get all values for a field (like friends[]) from a FormData and convert each to string.
      const getAllFromFD = (fd, key) => fd.getAll(key).map(String);

      // Build the payload the backend expects (plain object)
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
        // StoryForm sent a plain object (no files)
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

      // the newly created story if id exists, else back to list
      if (created && created._id) navigate(`/stories/${created._id}`);
      else navigate("/stories");
    } catch (e) {
      setError(e?.message || "Failed to add story.");
    } finally {
      setSubmitting(false);
    }
  }

  // Return structure mirrors AddFriendPage:
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