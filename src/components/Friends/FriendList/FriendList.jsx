import styles from "./FriendList.module.scss";
import FriendCard from "../FriendCard/FriendCard";

/**
 * FriendList
 * - Renders a responsive grid of FriendCard
 */
export default function FriendList({ friends = [] }) {
  if (!friends.length) {
    return <p className={styles.empty}>No friends match your filters.</p>;
  }
  return (
    <div className={styles.grid}>
      {friends.map((f) => (
        <FriendCard key={f._id || `${f.name}-${f.nickName}`} friend={f} />
      ))}
    </div>
  );
}
