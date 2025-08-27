import React, { useMemo, useState } from "react";

// single-select mood (string) with chip UI and a "+" button (like your mockup)
const DEFAULT_MOODS = [
  { key: "happy",     label: "Happy 😊" },
  { key: "sad",       label: "Sad 😢" },
  { key: "excited",   label: "Excited 🤩" },
  { key: "nostalgic", label: "Nostalgic 🕰️" },
  { key: "angry",     label: "Angry 😠" },
  { key: "chill",     label: "Chill 😎" },
  { key: "grateful",  label: "Grateful 🙏" },
  { key: "tired",     label: "Tired 🥱" },
];

export default function MoodSelector({
  value = "",                 // string mood key
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
    onChange && onChange(currentKey); // store single mood as string
    setCurrentKey("");
  };

  const clearMood = () => onChange && onChange("");

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

      {!!value && (
        <div>
          <span>
            {moodLabelByKey.get(value) || value}
            <button type="button" onClick={clearMood} aria-label="remove mood"> ⓧ </button>
          </span>
        </div>
      )}
      {/* hidden mirror so FormData always contains a plain string 'mood' */}
      <input type="hidden" name="mood" value={value || ""} />
    </div>
  );
}
