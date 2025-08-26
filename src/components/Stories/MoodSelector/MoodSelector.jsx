// src/components/Stories/MoodSelector.jsx
import React, { useMemo, useState } from "react";

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
  value = [],       
  onChange,
  moods = DEFAULT_MOODS,
}) {
  // normalizes to an array in case the parent passed a single value
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  // finds the currently selected mood key in the <select>
  const [currentKey, setCurrentKey] = useState("");

  // available options exclude already selected moods
  const availableOptions = useMemo(() => {
    const selectedSet = new Set(selected);
    return (moods || []).filter((m) => !selectedSet.has(m.key));
  }, [moods, selected]);

  // add currentKey -> selected
  function handleAdd() {
    if (!currentKey) return;
    if (selected.includes(currentKey)) return;
    onChange && onChange([...selected, currentKey]);
    setCurrentKey("");
  }

  // removes a mood by key
  function handleRemove(key) {
    onChange && onChange(selected.filter((k) => k !== key));
  }

  // helper to get label for a mood key
  const moodLabel = (key) => (moods.find((m) => m.key === key)?.label || key);

  return (
    <div>
      {/* Selector row: dropdown + add button */}
      <div>
        <select value={currentKey} onChange={(e) => setCurrentKey(e.target.value)}>
          <option value="">-- Select mood --</option>
          {availableOptions.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAdd} disabled={!currentKey}>
          +
        </button>
      </div>

      {/* Selected mood chips */}
      {selected.length > 0 && (
        <div>
          {selected.map((key) => (
            <span key={key}>
              {moodLabel(key)}
              <button
                type="button"
                onClick={() => handleRemove(key)}
                aria-label={`remove ${key}`}
              >
                ⓧ
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
