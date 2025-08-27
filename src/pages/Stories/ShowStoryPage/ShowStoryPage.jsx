import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getToken } from "../../../utilities/users-service";
import styles from "./ShowStoryPage.module.scss";

// Mood label map (keeps things pretty if back-end stores keys)
const DEFAULT_MOOD_LABELS = new Map([
  ["happy", "Happy 😊"],
  ["sad", "Sad 😢"],
  ["excited", "Excited 🤩"],
  ["nostalgic", "Nostalgic 🕰️"],
  ["angry", "Angry 🧿"],
  ["chill", "Chill 😎"],
  ["grateful", "Grateful 🙏"],
  ["tired", "Tired 🥱"],
]);

// Universal moods normalizer
function normalizeMoods(input) {
  if (input == null) return [];
  const arr = Array.isArray(input) ? input : [input];

  const parts = arr.flatMap((item) => {
    if (item == null) return [];
    if (typeof item === "string") return item.split(",");
    if (typeof item === "object") {
      const raw = item.value ?? item.label ?? item.name ?? item.mood ?? "";
      return String(raw).split(",");
    }
    return [String(item)];
  });

  const clean = parts.map((s) => String(s).trim()).filter(Boolean);
  return Array.from(new Set(clean));
}

export default function ShowStoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const idOf = (s) => s?._id || s?.id;

  const [story, setStory] = useState(() => location.state?.story || null);

  useEffect(() => {
    if (story) return;
    if (typeof window === "undefined") return;

    const readJSON = (k) => {
      try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };
    const extras = readJSON("stories:extras") || [];
    const snapshot = readJSON("stories:lastSnapshot") || [];
    const lastNew = readJSON("stories:lastNew") || readJSON("lastNewStory");
    const all = [...extras, ...snapshot, ...(lastNew ? [lastNew] : [])];
    const found = all.find((s) => String(idOf(s)) === String(id));
    if (found) setStory(found);
  }, [id, story]);

  const allImages = useMemo(() => {
    if (!story) return [];
    if (Array.isArray(story.photos) && story.photos.length)
      return story.photos.filter(Boolean);
    if (Array.isArray(story.mediaUrls) && story.mediaUrls.length)
      return story.mediaUrls.filter(Boolean);
    if (Array.isArray(story.images) && story.images.length)
      return story.images.filter(Boolean);
    if (typeof story.photoUrl === "string" && story.photoUrl)
      return [story.photoUrl];
    if (typeof story.cover === "string" && story.cover) return [story.cover];
    return [];
  }, [story]);

  const [friendIndex, setFriendIndex] = useState(null);
  useEffect(() => {
    let active = true;
    if (
      !story ||
      !Array.isArray(story?.friendsInvolved) ||
      !story.friendsInvolved.length
    )
      return;

    const hasNames = story.friendsInvolved.some(
      (f) =>
        typeof f === "object" && (f?.name || f?.fullName || f?.displayName)
    );
    if (hasNames) return;

    async function loadFriends() {
      const readJSON = (k) => {
        try {
          const raw = localStorage.getItem(k);
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
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
        try {
          localStorage.setItem("friends:index", JSON.stringify(list || []));
        } catch {}
      } catch {}
    }

    loadFriends();
    return () => {
      active = false;
    };
  }, [story]);

  const fmtDate = (d) => {
    const dt = d ? new Date(d) : null;
    if (!dt || Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const fmtLogged = (d) => {
    const dt = d ? new Date(d) : null;
    if (!dt || Number.isNaN(dt.getTime())) return "";
    const datePart = dt.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const timePart = dt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart}, ${timePart}`;
  };

  // ---- Moods: normalize robustly & map to nice labels
  const moods = useMemo(() => {
    if (!story) return [];
    const raw = normalizeMoods(story?.moods ?? story?.mood);
    const pretty = raw.map((m) => {
      const key = String(m).toLowerCase();
      return DEFAULT_MOOD_LABELS.get(key) || m;
    });
    const seen = new Set();
    return pretty.filter((m) => (seen.has(m) ? false : (seen.add(m), true)));
  }, [story]);

  const friends = useMemo(() => {
    const arr = story?.friendsInvolved || [];
    const labelOf = (f) => {
      if (typeof f === "object" && f)
        return (
          f.name || f.fullName || f.displayName || f._id || f.id
        );
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
      <main className={styles.page}>
        <div className={styles.container}>
          <p>Story not found.</p>
          <p>
            <Link to="/stories">← Back to all stories</Link>
          </p>
        </div>
      </main>
    );
  }

  const sid = String(idOf(story) || id || "").trim();

  function pruneAndExit() {
    const readJSON = (k) => {
      try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };
    const writeJSON = (k, v) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    };
    const extras = readJSON("stories:extras") || [];
    const next = extras.filter((s) => String(idOf(s)) !== sid);
    writeJSON("stories:extras", next);
    navigate("/stories");
  }

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
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{story.title || "Untitled story"}</h1>

        <section className={styles.card}>
          {/* LEFT: media */}
          <div className={styles.media}>
            <img
              className={styles.cover}
              src={allImages[0] || ""}
              alt={story.title ? `${story.title} photo 1` : "story photo"}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            {allImages.length > 1 && (
              <div className={styles.thumbRow}>
                {allImages.slice(1).map((src, i) => (
                  <img
                    key={i}
                    className={styles.thumb}
                    src={src}
                    alt={`thumb ${i + 2}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: details */}
          <div className={styles.content}>
            {story.date && (
              <div className={styles.metaLine}>
                <span className={styles.metaLabel}>Date:</span>{" "}
                {fmtDate(story.date)}
              </div>
            )}

            {story.content && <div className={styles.body}>{story.content}</div>}

            {friends.length > 0 && (
              <div className={styles.metaLine}>
                <span className={styles.metaLabel}>Friends involved:</span>
                <div className={styles.tags}>
                  {friends.map((f, i) => (
                    <span className={styles.tag} key={`${f}-${i}`}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {moods.length > 0 && (
              <div className={styles.metaLine}>
                <span className={styles.metaLabel}>
                  {moods.length > 1 ? "Moods:" : "Mood:"}
                </span>
                <div className={styles.tags}>
                  {moods.map((m, i) => (
                    <span className={styles.tag} key={`${m}-${i}`}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {story.createdAt && (
              <div className={styles.metaLine}>
                Logged on {fmtLogged(story.createdAt)}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnBack}`}
                onClick={() => navigate("/stories")}
              >
                &larr; Back
              </button>
              {sid && (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnEdit}`}
                    onClick={() =>
                      navigate(`/stories/${sid}/edit`, { state: { story } })
                    }
                  >
                    Edit story
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={handleDelete}
                  >
                    Remove story
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <p className={styles.footerNote}></p>
      </div>
    </main>
  );
}
