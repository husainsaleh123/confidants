import React, { useState } from "react";
// import styles from "./EditProfileForm.module.scss"; // keep/remove as you prefer

export default function EditProfileForm({ user = {}, onSubmit, setUser }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setPhoto(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      if (password) fd.append("password", password);
      if (photo) fd.append("avatar", photo); // change to 'profilePic' if your API expects that

      const result = await onSubmit(fd); // parent handles API
      if (setUser && result) setUser(result.user || result);
    } catch (err) {
      setError(err?.message || "Update failed");
    }
  };

  return (
    <div>
      <h2>Edit your profile, {user.name || "User"}.</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
        <label>Upload photo</label>
        <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />

        <label>Name</label>
        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Save changes</button>
      </form>

      {error ? <p>{error}</p> : null}
    </div>
  );
}
