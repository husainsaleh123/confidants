import styles from "./TagList.module.scss";

/**
 * TagList
 * - Dropdown of unique tags
 * - Empty value means "All tags"
 */
export default function TagList({ tags = [], value = "", onChange, className = "" }) {
  return (
    <label className={`${styles.wrap} ${className}`}>
      <span className={styles.label}>Tag</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
