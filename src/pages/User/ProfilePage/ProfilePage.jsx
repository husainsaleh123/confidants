// import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePage({ user }) {
  // guard against missing user
  const name = user?.name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.profilePic || "";

  return (
    <section>
      <h1>Welcome to your profile page!</h1>
      <div>
        <div>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name}'s avatar`} width={64} height={64} />
          ) : (
            // placeholder circle
            <div aria-label="avatar placeholder" />            
          )}
        </div>

        {/* Middle: user name + email (from your user.js model) */}
        <div>
          <h2>{name}</h2>
          {email && <p>{email}</p>}
        </div>

        {/* link to Friends and Edit Profile */}
        <div>
          {/* Link to friends list */}
          <Link to="/friends">
            <button type="button">Friends</button>
          </Link>

          {/* Link to your EditProfilePage*/}
          <Link to="/profile/:id/edit">
            <button type="button">Edit</button>
          </Link>
        </div>
      </div>
    </section>
  );
}