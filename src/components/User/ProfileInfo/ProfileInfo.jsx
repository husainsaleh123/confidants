import React from "react";
import styles from "./ProfileInfo.module.scss";

export default function ProfileInfo({ user }) {
  return (
    <div className={styles.profileInfo}>
      <div className={styles.headerSection}>
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
      <div className={styles.storiesSection}>
        <h3>{user.name}'s Recent Stories</h3>
        <p className={styles.noStories}>Add your first story!</p>
        <div className={styles.storyActions}>
          <button className={styles.addStoryBtn}>+ Add story</button>
          <button className={styles.viewStoriesBtn}>👁️ View all stories</button>
        </div>
      </div>
    </div>
  );
}
