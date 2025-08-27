import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditProfileForm from "../../../components/User/EditProfileForm/EditProfileForm";
import { getToken } from "../../../utilities/users-service";

export default function EditProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.id;

  const candidates = (id) => {
    const idPart = encodeURIComponent(id || "");
    // common bases (self + by-id + “update” flavors)
    const bases = [
      "/api/users/me",
      id ? `/api/users/${idPart}` : null,
      "/api/users/update",
      "/api/users/profile",
      "/api/profile/me",
      id ? `/api/profile/${idPart}` : null,
      "/api/user/me",
      id ? `/api/user/${idPart}` : null,
      "/api/me/profile",
      "/api/account/me",
    ].filter(Boolean);

    // try PUT → PATCH → POST for each base
    const methods = ["PUT", "PATCH", "POST"];
    const all = [];
    for (const base of bases) {
      for (const m of methods) all.push({ url: base, method: m });
    }
    return all;
  };

  async function preflight(url, token) {
    // quick probe: OPTIONS (if supported) or GET for existence
    try {
      const opt = await fetch(url, {
        method: "OPTIONS",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (opt.ok || opt.status === 204) return true;
    } catch {}
    try {
      const get = await fetch(url, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      // 200/401/405 means the route exists in some form
      if ([200, 401, 405].includes(get.status)) return true;
    } catch {}
    return false;
  }

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

    // 404/405 → not a match; let caller try the next candidate
    if (res.status === 404 || res.status === 405) return null;

    // other errors → raise a readable message (strip HTML if present)
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

      // filter to routes that at least exist (fast preflight)
      const viable = [];
      for (const c of attempts) {
        // skip id routes if no id
        if (c.url.includes("//")) continue;
        if (c.url.includes("%") && !userId) continue;
        const exists = await preflight(c.url, token);
        if (exists) viable.push(c);
      }

      let saved = null;
      for (const v of viable) {
        const out = await tryOne(v.url, v.method, fd, token);
        if (out) {
          saved = out;
          break;
        }
      }

      if (!saved) {
        // final attempt without preflight, in case OPTIONS/GET are blocked
        for (const c of attempts) {
          const out = await tryOne(c.url, c.method, fd, token);
          if (out) {
            saved = out;
            break;
          }
        }
      }

      if (!saved) {
        throw new Error(
          "No matching profile update route. Tried /api/users/me, /api/users/:id, /api/users/update, /api/users/profile, /api/profile/me, /api/profile/:id, /api/user/me, /api/user/:id, /api/me/profile, /api/account/me (PUT/PATCH/POST)."
        );
      }

      // update app state and go back to profile
      if (setUser) setUser(saved);
      navigate(userId ? `/profile/${userId}` : "/profile");
      return saved; // so the child form can consume it if needed
    } catch (e) {
      setError(e?.message || "Update failed");
      // surface to child for optional setUser
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
