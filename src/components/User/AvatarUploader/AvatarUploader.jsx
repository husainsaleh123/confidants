import React, { useRef, useState } from "react";
import styles from "./AvatarUploader.module.scss";

export default function AvatarUploader({ avatarUrl, onAvatarChange }) {
  const [preview, setPreview] = useState(avatarUrl || "");
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onAvatarChange) onAvatarChange(file);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleClick() {
    fileInputRef.current.click();
  }

  return (
    <div className={styles.avatarUploader}>
      <div className={styles.avatarPreview} onClick={handleClick}>
        {preview ? (
          <img src={preview} alt="Avatar" className={styles.avatarImg} />
        ) : (
          <div className={styles.placeholder}>
            <span>Upload</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
