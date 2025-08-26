// src/pages/User/ProfilePage/EditProfilePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditProfileForm from "../../../components/User/EditProfileForm/EditProfileForm";

export default function EditProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  // Track submitting/error like your class examples
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  // The form already appends: name, email, (optional) password, and (optional) avatar
  async function handleSubmit(fd) {
    try {
      setSubmitting(true);
      setError("");

      // Below, we'll use /api/users/. 
      const res = await fetch("/api/users", {
        method: "PUT",
        body: fd, // FormData
      });

      if (!res.ok) {
        // surfaces any error text from the server
        const msg = await res.text();
        throw new Error(msg || "Failed to update profile");
      }

      // Expect the updated user back (with profilePic resolved server-side)
      const updated = await res.json();

      // Update app-level user state
      if (setUser) setUser(updated.user || updated);

      // Navigate wherever you want post-save (e.g., back to profile)
      navigate("/profile/:id");
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      {/* Header row (title + back link), like your class structure */}
      <div>
        <h1>Edit your profile, {user?.name || "User"}.</h1>
        <Link to="/profile/:id">  {/* Links to profile page */}
          ← Back to profile
        </Link>
      </div>

      {/* Any error from save */}
      {error && <p>{error}</p>}

      {/* Main card: to render the form's data*/}
      <div>
        <EditProfileForm
          user={user}
          setUser={setUser}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
