
import styles from "./RecurringToggle.module.scss";

export default function RecurringToggle({ value, onChange }) {
  const [isRecurring, setIsRecurring] = useState(!!value?.enabled);
  const [interval, setInterval] = useState(value?.interval || "yearly");

  const handleToggle = (e) => {
    const checked = e.target.checked;
    setIsRecurring(checked);
    onChange?.({
      enabled: checked,
      interval: checked ? interval : null,
    });
  };

  const handleIntervalChange = (e) => {
    const newInterval = e.target.value;
    setInterval(newInterval);
    onChange?.({
      enabled: isRecurring,
      interval: newInterval,
    });
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={handleToggle}
        />
        <span>Repeat this event</span>
      </label>

      {isRecurring && (
        <select
          className={styles.select}
          value={interval}
          onChange={handleIntervalChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      )}
    </div>
  );
}
