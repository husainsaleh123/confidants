// src/components/Stories/PhotoUploader/PhotoUploader.jsx
import React, { useRef, useState, useEffect } from "react";

export default function PhotoUploader({ value, onChange, className = "" }) {
  // ref so we can trigger the hidden <input type="file" />
  const fileInputRef = useRef(null);

  // local state to keep track of the preview image (URL or File preview)
  const [preview, setPreview] = useState(value || null);

  // when the incoming `value` prop changes (like editing an existing profile),
  // update the preview
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  // Handle when user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; // only take the first file
    if (file) {
      // generate a temporary preview URL from the file
      setPreview(URL.createObjectURL(file));
      // inform parent component about the new file
      onChange && onChange(file);
    }
  };

  // Handle remove/reset picture
  const handleRemove = () => {
    setPreview(null); // clear preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear the <input> value
    }
    // inform parent that there's no picture anymore
    onChange && onChange(null);
  };

  return (
    <div>
      {/* If there is a preview, show the image + buttons to change/remove */}
      {preview ? (
        <div>
          <img
            src={preview}
            alt="Profile preview"
            width={120}
            height={120}
          />
          <div>
            {/* Trigger file picker again */}
            <button type="button" className={className} onClick={() => fileInputRef.current?.click()}>
              Change photo
            </button>
            {/* Remove/reset */}
            <button type="button" className={className} onClick={handleRemove}>
              Remove photo
            </button>
          </div>
        </div>
      ) : (
        // If no preview, show "Upload photo" button
        <div>
         <button type="button" className={className} onClick={() => fileInputRef.current?.click()}>
            Upload photo
          </button>
        </div>
      )}

      {/* Hidden file input – real uploader element */}
      <input
        type="file"
        accept="image/*"                // restrict to images only
        ref={fileInputRef}              // assign ref so we can trigger click programmatically
        style={{ display: "none" }}     // hide it (we use our custom buttons instead)
        onChange={handleFileChange}     // when user picks a file
      />
    </div>
  );
}