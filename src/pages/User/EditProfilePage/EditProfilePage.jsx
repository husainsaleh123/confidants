// src/pages/User/EditProfilePage/EditProfilePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditProfileForm from "../../../components/User/EditProfileForm/EditProfileForm";
import { getToken } from "../../../utilities/users-service";

export default function EditProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.id;

  async function handleSubmit(formData) {
    try {
      setSubmitting(true);
      setError("");

      // Ensure we have FormData (EditProfileForm should already send it)
      const fd =
        formData instanceof FormData
          ? formData
          : (() => {
              const f = new FormData();
              Object.entries(formData || {}).forEach(([k, v]) => f.append(k, v));
              return f;
            })();

      // Auth header (do NOT set Content-Type when sending FormData)
      const token = getToken();
      const res = await fetch(`/api/users/${encodeURIComponent(userId || "me")}`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });

      if (!res.ok) {
        // Try to show server-provided error
        let msg = "";
        try {
          msg = await res.text();
        } catch {}
        throw new Error(msg || `Failed to update profile (HTTP ${res.status})`);
      }

      const data = await res.json();
      const updatedUser = data?.user ?? data;

      // Reflect changes in app state
      if (setUser && updatedUser) setUser(updatedUser);

      // Back to profile page (real id, not "/profile/:id")
      if (userId) navigate(`/profile/${userId}`);
      else navigate("/profile/me");
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div>
        <h1>Edit your profile, {user?.name || "User"}.</h1>
        {userId ? (
          <Link to={`/profile/${userId}`}>← Back to profile</Link>
        ) : (
          <Link to="/profile">← Back to profile</Link>
        )}
      </div>

      {error && <p>{error}</p>}

      <div>
        <EditProfileForm
          user={user}
          setUser={setUser}
          onSubmit={handleSubmit}
          submitLabel={submitting ? "Saving..." : "Save changes"}
        />
      </div>
    </section>
  );
}
