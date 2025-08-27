// src/components/Stories/PhotoUploader/PhotoUploader.jsx
import React, { useRef, useState, useEffect } from "react";

export default function PhotoUploader({
  files: filesProp,       // CHANGED: preferred prop (array of File or URLs)
  value,                   // backward-compat: single value
  onChange,
  className = ""
}) {
  const fileInputRef = useRef(null);

  // CHANGED: normalize into an array of items (File or string URL)
  const normalize = (val) => {
    if (Array.isArray(val)) return val;
    if (val == null) return [];
    return [val];
  };

  const [files, setFiles] = useState(normalize(filesProp ?? value));
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    setFiles(normalize(filesProp ?? value));
  }, [filesProp, value]);

  // CHANGED: build preview URLs for any File entries
  useEffect(() => {
    const urls = files.map((f) => (f instanceof File ? URL.createObjectURL(f) : String(f)));
    setPreviews(urls);
    // revoke previous object URLs when files change
    return () => {
      urls.forEach((u, i) => {
        if (files[i] instanceof File) URL.revokeObjectURL(u);
      });
    };
  }, [files]);

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    const next = list.length ? list : [];
    setFiles(next);
    onChange && onChange(next); // CHANGED: return array
  };

  const handleRemoveIndex = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange && onChange(next);
    if (fileInputRef.current && next.length === 0) {
      fileInputRef.current.value = "";
    }
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        {previews.map((src, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={src} alt={`preview ${i+1}`} width={120} height={120} />
            <div>
              <button type="button" className={className} onClick={() => handleRemoveIndex(i)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button type="button" className={className} onClick={openPicker}>
          {previews.length ? "Add / Replace Photos" : "Upload Photos"}
        </button>
      </div>

      {/* CHANGED: allow multiple file selection */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
