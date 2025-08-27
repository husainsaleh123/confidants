// src/pages/Stories/ShowStoryPage/ShowStoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getToken } from "../../../utilities/users-service"; // for authenticated raw requests

export default function ShowStoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const idOf = (s) => s?._id || s?.id;

  // Prefer the story passed via navigation state; fall back to local cache
  const [story, setStory] = useState(() => location.state?.story || null);

  useEffect(() => {
    if (story) return;
    if (typeof window === "undefined") return;

    const readJSON = (k) => {
      try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; }
    };

    const extras = readJSON("stories:extras") || [];
    const snapshot = readJSON("stories:lastSnapshot") || [];
    const lastNew = readJSON("lastNewStory");

    const all = [...extras, ...snapshot, ...(lastNew ? [lastNew] : [])];
    const found = all.find((s) => String(idOf(s)) === String(id));

    if (found) setStory(found);
  }, [id, story]);

  // Image helpers
  const allImages = useMemo(() => {
    if (!story) return [];
    if (Array.isArray(story.photos) && story.photos.length) return story.photos.filter(Boolean);
    if (Array.isArray(story.mediaUrls) && story.mediaUrls.length) return story.mediaUrls.filter(Boolean);
    if (Array.isArray(story.images) && story.images.length) return story.images.filter(Boolean);
    if (typeof story.photoUrl === "string" && story.photoUrl) return [story.photoUrl];
    if (typeof story.cover === "string" && story.cover) return [story.cover];
    return [];
  }, [story]);

  // Optional: resolve friend IDs -> names if the story only has IDs
  const [friendIndex, setFriendIndex] = useState(null);
  useEffect(() => {
    let active = true;
    if (!story || !Array.isArray(story?.friendsInvolved) || !story.friendsInvolved.length) return;

    const hasNames = story.friendsInvolved.some(
      (f) => typeof f === "object" && (f?.name || f?.fullName || f?.displayName)
    );
    if (hasNames) return;

    async function loadFriends() {
      const readJSON = (k) => {
        try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; }
      };
      const cached = readJSON("friends:index");
      if (cached && active) {
        const map = new Map(cached.map((f) => [String(f?._id || f?.id), f]));
        setFriendIndex(map);
      }

      try {
        const token = getToken();
        const res = await fetch("/api/friends", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const list = await res.json();
        if (!active) return;
        const map = new Map((list || []).map((f) => [String(f?._id || f?.id), f]));
        setFriendIndex(map);
        try { localStorage.setItem("friends:index", JSON.stringify(list || [])); } catch {}
      } catch { /* ignore */ }
    }

    loadFriends();
    return () => { active = false; };
  }, [story]);

  // Formatters
  const fmtDate = (d) => {
    const dt = d ? new Date(d) : null;
    if (!dt || Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
  };
  const fmtLogged = (d) => {
    const dt = d ? new Date(d) : null;
    if (!dt || Number.isNaN(dt.getTime())) return "";
    const datePart = dt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
    const timePart = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${datePart}, ${timePart}`;
  };

  // Friend labels from objects or resolved IDs
  const friends = useMemo(() => {
    const arr = story?.friendsInvolved || [];
    const labelOf = (f) => {
      if (typeof f === "object" && f) return f.name || f.fullName || f.displayName || f._id || f.id;
      const idStr = String(f);
      if (friendIndex && friendIndex.has(idStr)) {
        const fo = friendIndex.get(idStr);
        return fo?.name || fo?.fullName || fo?.displayName || idStr;
      }
      return idStr;
    };
    return arr.map(labelOf).filter(Boolean);
  }, [story, friendIndex]);

  if (!story) {
    return (
      <main>
        <p>Story not found.</p>
        <p><Link to="/stories">← Back to all stories</Link></p>
      </main>
    );
  }

  const sid = String(idOf(story) || id || "").trim();

  function pruneAndExit() {
    const readJSON = (k) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; } };
    const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
    const extras = readJSON("stories:extras") || [];
    const next = extras.filter((s) => String(idOf(s)) !== sid);
    writeJSON("stories:extras", next);
    navigate("/stories");
  }

  // Delete: treat 404/"not found" as success to clean up ghost stories
  async function handleDelete() {
    if (!sid) {
      alert("Missing story id.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    const token = getToken();
    const url = `/api/stories/${encodeURIComponent(sid)}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
          : { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const lower = (text || "").toLowerCase();
        if (res.status === 404 || lower.includes("not found")) {
          pruneAndExit();
          return;
        }
        throw new Error(text || `HTTP ${res.status}`);
      }
      pruneAndExit();
    } catch (err) {
      const lower = String(err?.message || "").toLowerCase();
      if (lower.includes("not found")) {
        pruneAndExit();
        return;
      }
      alert(err?.message || "Failed to delete story.");
    }
  }

  return (
    <main>
      <h1>{story.title || "Untitled story"}</h1>

      {/* Images */}
      {allImages.length > 0 && (
        <section>
          {/* primary image */}
          <img src={allImages[0]} alt={story.title ? `${story.title} photo 1` : "story photo"} />
          {/* additional images */}
          {allImages.slice(1).map((src, i) => (
            <img key={i} src={src} alt={story.title ? `${story.title} photo ${i + 2}` : `story photo ${i + 2}`} />
          ))}
        </section>
      )}

      {story.date && <p><strong>Date:</strong> {fmtDate(story.date)}</p>}

      {friends.length > 0 && (
        <p>
          <strong>Friends involved:</strong> {friends.join(", ")}
        </p>
      )}

      {Array.isArray(story.moods) && story.moods.length > 0 && (
        <p><strong>Mood:</strong> {story.moods.join(", ")}</p>
      )}
      {typeof story.mood === "string" && story.mood && (
        <p><strong>Mood:</strong> {story.mood}</p>
      )}

      {story.content && <p>{story.content}</p>}
      {story.createdAt && <p>Logged on {fmtLogged(story.createdAt)}</p>}

      <div>
        <button type="button" onClick={() => navigate("/stories")}>Back</button>{" "}
        {sid && (
          <>
            <button
              type="button"
              onClick={() => navigate(`/stories/${sid}/edit`, { state: { story } })}
            >
              Edit story
            </button>{" "}
            <button type="button" onClick={handleDelete}>
              Remove story
            </button>
          </>
        )}
      </div>
    </main>
  );
}
