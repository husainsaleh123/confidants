import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditProfileForm from "../../../components/User/EditProfileForm/EditProfileForm";
import { getToken } from "../../../utilities/users-service";

export default function EditProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.id;

  // Hit the backend directly (bypass Vite proxy / port drift)
  const API_BASE = `${window.location.protocol}//${window.location.hostname}:3000`;

  const candidates = (id) => {
    const idPart = encodeURIComponent(id || "");
    const bases = [
      `${API_BASE}/api/users/me`,
      id ? `${API_BASE}/api/users/${idPart}` : null,
      `${API_BASE}/api/users/update`,
      `${API_BASE}/api/users/profile`,
      `${API_BASE}/api/profile/me`,
      id ? `${API_BASE}/api/profile/${idPart}` : null,
      `${API_BASE}/api/user/me`,
      id ? `${API_BASE}/api/user/${idPart}` : null,
      `${API_BASE}/api/me/profile`,
      `${API_BASE}/api/account/me`,
    ].filter(Boolean);

    const methods = ["PUT", "PATCH", "POST"];
    const out = [];
    for (const b of bases) for (const m of methods) out.push({ url: b, method: m });
    return out;
  };

  async function tryOne(url, method, fd, token) {
    const res = await fetch(url, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    });

    if (res.ok) {
      try {
        const json = await res.json();
        return json?.user ?? json ?? {};
      } catch {
        return {};
      }
    }
    if (res.status === 404 || res.status === 405) return null;

    let msg = "";
    try {
      const text = await res.text();
      msg = text.replace(/<[^>]*>/g, "").trim();
    } catch {}
    throw new Error(msg || `Profile update failed (HTTP ${res.status})`);
  }

  async function handleSubmit(fd) {
    try {
      setSubmitting(true);
      setError("");
      const token = getToken();

      const attempts = candidates(userId);
      let saved = null;

      for (const c of attempts) {
        // skip id routes when no id
        if (c.url.includes("/undefined")) continue;
        const out = await tryOne(c.url, c.method, fd, token);
        if (out) {
          saved = out;
          break;
        }
      }

      if (!saved) {
        throw new Error(
          "No matching profile update route on the backend. Tried several common endpoints on :3000."
        );
      }

      if (setUser) setUser(saved);
      navigate(userId ? `/profile/${userId}` : "/profile");
      return saved;
    } catch (e) {
      setError(e?.message || "Update failed");
      throw e;
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
