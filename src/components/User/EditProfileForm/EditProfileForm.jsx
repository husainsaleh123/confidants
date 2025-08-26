import React from "react";
import styles from "./EditProfileForm.module.scss";

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
      if (photo) fd.append("avatar", photo);

      let result;
      if (onSubmit) {
        result = await onSubmit(fd);
      } else {
        // Fallback: call your API directly (adjust endpoint/method as needed)
        const res = await fetch("/api/users", { method: "PUT", body: fd });
        if (!res.ok) throw new Error("Update failed");
        result = await res.json();
      }

      if (setUser && result) {
        setUser(result.user || result);
      }
    } catch (err) {
      setError(err.message || "Update failed");
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

      <p>{error}</p>
    </div>
  );
}