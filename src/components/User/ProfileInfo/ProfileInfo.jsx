import React from "react";
import styles from "./ProfileInfo.module.scss";

export default function ProfileInfo({ user }) {
  return (
    <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          {/* Placeholder avatar */}
          <div className={styles.avatarCircle}></div>
        </div>
        <div className={styles.userDetails}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.friendsBtn}>Friends</button>
          <button className={styles.editBtn}>Edit</button>
        </div>
    </div>
  );
}
