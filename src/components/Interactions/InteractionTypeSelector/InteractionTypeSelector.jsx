import { useMemo, useState } from "react";
import styles from "./InteractionTypeSelector.module.scss";

const DEFAULT_TYPES = [
  "Call",
  "Text",
  "In person",
  "Gift",
  "Reminder",
  "Birthday",
  "Anniversary",
  "Event",
  "Apology",
  "Thank you",
  "Other",
];

export default function InteractionTypeSelector({
  value = "",
  onChange,
  options = DEFAULT_TYPES,
  allowCustom = true,
  disabled = false,
  placeholder = "Select type",
}) {
  const [list, setList] = useState(options);
  const [custom, setCustom] = useState("");

  // ensure current value shows up in the dropdown even if it’s custom
  const merged = useMemo(() => {
    if (!value || list.includes(value)) return list;
    return [value, ...list];
  }, [value, list]);

  function handleAdd() {
    const name = custom.trim();
    if (!name) return;
    if (!merged.includes(name)) setList((prev) => [name, ...prev]);
    onChange?.(name);
    setCustom("");
  }

  return (
    <div className={styles.wrap}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-label="Interaction type"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {merged.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {allowCustom && (
        <div className={styles.addRow}>
          <input
            className={styles.input}
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add custom type…"
            disabled={disabled}
          />
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={disabled || !custom.trim()}
            title="Add type"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
