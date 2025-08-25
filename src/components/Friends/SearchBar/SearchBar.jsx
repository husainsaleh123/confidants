import styles from "./SearchBar.module.scss";

/**
 * SearchBar
 * - Text input for name/nickname filter
 * - Sentiment selector: "", "likes", "dislikes", "neutral"
 */
export default function SearchBar({
  value,
  onChange,
  sentiment = "",
  onSentimentChange,
  className = "",
}) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search by name or nickname…"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />

      <select
        className={styles.select}
        value={sentiment}
        onChange={(e) => onSentimentChange?.(e.target.value)}
      >
        <option value="">All sentiments</option>
        <option value="likes">Has Likes</option>
        <option value="dislikes">Has Dislikes</option>
        <option value="neutral">Has Neutral</option>
      </select>
    </div>
  );
}
