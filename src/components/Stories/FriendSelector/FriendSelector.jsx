// src/components/Stories/FriendSelector.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function FriendSelector({
  value = [],
  onChange,
  friends,           // optional: preloaded friends
  fetchFriends,      // optional: async loader
}) {
  // full friend list to choose from
  const [allFriends, setAllFriends] = useState(friends || []);
  // which friend is currently selected in the <select>
  const [currentId, setCurrentId] = useState("");

  // keep internal list in sync if parent passes/updates `friends`
  useEffect(() => {
    if (Array.isArray(friends)) setAllFriends(friends);
  }, [friends]);

  // initial load if no `friends` prop
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (Array.isArray(friends) && friends.length) return; // already provided

        let list = [];
        if (fetchFriends) {
          list = await fetchFriends();
        } else {
          // fallback to your API route – adjust if your backend differs
          const res = await fetch("/api/friends");
          if (!res.ok) throw new Error("Failed to load friends");
          list = await res.json();
        }

        if (!cancelled) setAllFriends(Array.isArray(list) ? list : []);
      } catch (e) {
        // keep silent (or console.error if you want)
        // console.error(e);
        if (!cancelled) setAllFriends([]);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetchFriends, friends]);

  // Build a map for easy lookups (id -> friend)
  const friendById = useMemo(() => {
    const map = new Map();
    (allFriends || []).forEach((f) => {
      if (f && (f._id || f.id)) map.set(f._id || f.id, f);
    });
    return map;
  }, [allFriends]);

  // Add the currently selected friend ID to the list (if not already present)
  function handleAdd() {
    const id = currentId;
    if (!id) return;
    if (value.includes(id)) return; // already selected
    onChange && onChange([...value, id]);
    setCurrentId(""); // reset selection
  }

  // Remove friend by ID
  function handleRemove(id) {
    onChange && onChange(value.filter((v) => v !== id));
  }

  // Available options (exclude already selected ones)
  const availableOptions = useMemo(() => {
    const selectedSet = new Set(value);
    return (allFriends || []).filter((f) => !selectedSet.has(f._id || f.id));
  }, [allFriends, value]);

  return (
    <div>
      {/* Selector row: dropdown + add button */}
      <div>
        <select
          value={currentId}
          onChange={(e) => setCurrentId(e.target.value)}
        >
          <option value="">-- Select a friend --</option>
          {availableOptions.map((f) => {
            const id = f._id || f.id;
            return (
              <option key={id} value={id}>
                {f.name || "Friend"}
              </option>
            );
          })}
        </select>

        <button type="button" onClick={handleAdd} disabled={!currentId}>
          +
        </button>
      </div>

      {/* Selected chips */}
      {value.length > 0 && (
        <div>
          {value.map((id) => {
            const f = friendById.get(id);
            return (
              <span key={id}>
                {f?.name || "Friend"}
                <button type="button" onClick={() => handleRemove(id)} aria-label="remove friend">
                  ⓧ
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
