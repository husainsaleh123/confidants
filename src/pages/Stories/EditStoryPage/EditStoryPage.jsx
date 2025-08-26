// src/pages/EditStoryPage/EditStoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import EditProfileForm from "../../../components/User/EditProfileForm/EditProfileForm";

export default function EditProfilePage({
 
  profile: initialProfile = null,     
  userId,                              
  loadProfile,                         
  updateProfile,                       
  onCancel,                           
  onSaved,                            
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(!initialProfile && !!loadProfile);
  const [error, setError] = useState("");

  // Load profile if not provided
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (initialProfile || !loadProfile) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const p = await loadProfile(userId);
        if (!cancelled) setProfile(p || null);
      } catch {
        if (!cancelled) setError("Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [initialProfile, loadProfile, userId]);

  const handleSubmit = async (payload) => {
    const id = userId ?? profile?._id ?? profile?.id;
    const updater = updateProfile || (async () => null);

    // perform update
    const updated = await updater(id, payload);

    // fall back to local merge if updater doesn't return the object
    const merged = updated || { ...(profile || {}), ...payload };

    setProfile(merged);
    onSaved && onSaved(merged);
  };

  if (loading) return <main><p>Loading…</p></main>;
  if (error)   return <main><p>{error}</p></main>;

  return (
    <main>
      <h1>Edit Profile</h1>
      <EditProfileForm
        initial={profile || {}}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </main>
  );
}