import React, { useEffect, useMemo, useState } from "react";
import { getToken } from "../../../utilities/users-service";

export default function FriendSelector({
  value = [],            // array of friend IDs (strings)
  onChange,
  friends,               // optional: preloaded friends [{ _id, name, ... }]
  fetchFriends,          // optional: async () => [{ _id, name, ... }]
}) {
  const [allFriends, setAllFriends] = useState(friends || []);
  const [currentId, setCurrentId] = useState("");

  // default authorized fetcher if none passed
  const authedFetchFriends = async () => {
    const token = getToken();
    const res = await fetch("/api/friends", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load friends");
    return res.json();
  };

  useEffect(() => {
    if (Array.isArray(friends)) setAllFriends(friends);
  }, [friends]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // if already provided
        if (Array.isArray(friends) && friends.length) return;

        const list = (await (fetchFriends || authedFetchFriends)()) || [];
        if (!cancelled) setAllFriends(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setAllFriends([]);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetchFriends, friends]);

  const friendById = useMemo(() => {
    const map = new Map();
    (allFriends || []).forEach((f) => {
      const id = f?._id || f?.id;
      if (id) map.set(String(id), f);
    });
    return map;
  }, [allFriends]);

  const handleAdd = () => {
    const id = String(currentId || "");
    if (!id) return;
    const set = new Set((value || []).map(String));
    if (set.has(id)) return;
    onChange && onChange([...(value || []), id]);
    setCurrentId("");
  };

  const handleRemove = (id) => {
    const sid = String(id);
    onChange && onChange((value || []).filter((v) => String(v) !== sid));
  };

  const availableOptions = useMemo(() => {
    const selected = new Set((value || []).map(String));
    return (allFriends || []).filter((f) => !selected.has(String(f?._id || f?.id)));
  }, [allFriends, value]);

  const friendLabel = (f) =>
    f?.name ||
    f?.fullName ||
    [f?.firstName, f?.lastName].filter(Boolean).join(" ").trim() ||
    f?.username ||
    f?._id ||
    f?.id ||
    "Friend";

  return (
    <div>
      <div>
        <select value={currentId} onChange={(e) => setCurrentId(e.target.value)}>
          <option value="">-- Select a friend --</option>
          {availableOptions.map((f) => {
            const id = f?._id || f?.id;
            return (
              <option key={id} value={id}>
                {friendLabel(f)}
              </option>
            );
          })}
        </select>
        <button type="button" onClick={handleAdd} disabled={!currentId}>+</button>
      </div>

      {(value || []).length > 0 && (
        <div>
          {(value || []).map((id) => {
            const f = friendById.get(String(id));
            return (
              <span key={String(id)} style={{ marginRight: 6 }}>
                {friendLabel(f)}
                <button type="button" onClick={() => handleRemove(id)} aria-label="remove friend"> ⓧ </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
