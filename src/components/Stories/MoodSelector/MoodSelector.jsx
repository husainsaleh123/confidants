import React, { useMemo, useState } from "react";

const DEFAULT_MOODS = [
  { key: "happy",     label: "Happy 😊" },
  { key: "sad",       label: "Sad 😢" },
  { key: "excited",   label: "Excited 🤩" },
  { key: "nostalgic", label: "Nostalgic 🕰️" },
  { key: "angry",     label: "Angry 🧿" },
  { key: "chill",     label: "Chill 😎" },
  { key: "grateful",  label: "Grateful 🙏" },
  { key: "tired",     label: "Tired 🥱" },
];

export default function MoodSelector({
  value = [],                 // array of mood keys
  onChange,
  moods = DEFAULT_MOODS,
}) {
  const [currentKey, setCurrentKey] = useState("");

  const moodLabelByKey = useMemo(() => {
    const map = new Map();
    (moods || []).forEach((m) => map.set(m.key, m.label || m.key));
    return map;
  }, [moods]);

  const addSelected = () => {
    if (!currentKey) return;
    const set = new Set((value || []).filter(Boolean));
    if (set.has(currentKey)) return;
    const next = [...set, currentKey];
    onChange && onChange(Array.from(next));
    setCurrentKey("");
  };

  const removeMood = (k) => {
    onChange && onChange((value || []).filter((x) => x !== k));
  };

  return (
    <div>
      <div>
        <select value={currentKey} onChange={(e) => setCurrentKey(e.target.value)} name="mood-picker">
          <option value="">-- Select mood --</option>
          {moods.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label || m.key}
            </option>
          ))}
        </select>
        <button type="button" onClick={addSelected} disabled={!currentKey}>+</button>
      </div>

      {(value || []).length > 0 && (
        <div style={{ marginTop: 6 }}>
          {(value || []).map((k) => (
            <span key={k} style={{ marginRight: 6 }}>
              {moodLabelByKey.get(k) || k}
              <button type="button" onClick={() => removeMood(k)} aria-label="remove mood"> ⓧ </button>
            </span>
          ))}
        </div>
      )}

      {/* hidden mirrors so FormData contains 'moods[]' */}
      {(value || []).map((k, i) => (
        <input key={`${k}-${i}`} type="hidden" name="moods[]" value={k} />
      ))}
    </div>
  );
}
