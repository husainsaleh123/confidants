import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styles from './App.module.scss';
import { getUser } from '../../utilities/users-service';
import AddReminderPage from '../Events/AddReminderPage/AddReminderPage';
import EditReminderPage from '../Events/EditReminderPage/EditReminderPage';
import EventRemindersPage from '../Events/EventRemindersPage/EventRemindersPage';
import ShowReminderPage from '../Events/ShowReminderPage/ShowReminderPage';
import AddFriendPage from '../Friends/AddFriendPage/AddFriendPage';
import AllFriendsPage from '../Friends/AllFriendsPage/AllFriendsPage';
import EditFriendPage from '../Friends/EditFriendPage/EditFriendPage';
import FavouriteFriendsPage from '../Friends/FavouriteFriendsPage/FavouriteFriendsPage';
import ShowFriendPage from '../Friends/ShowFriendPage/ShowFriendPage';
import Home from '../Home/Home';
import AddInteractionPage from '../Interactions/AddInteractionPage/AddInteractionPage';
import AllInteractionsPage from '../Interactions/AllInteractionsPage/AllInteractionsPage';
import EditInteractionPage from '../Interactions/EditInteractionPage/EditInteractionPage';
import ShowInteractionPage from '../Interactions/ShowInteractionPage/ShowInteractionPage';
import AddStoryPage from '../Stories/AddStoryPage/AddStoryPage';
import AllStoriesPage from '../Stories/AllStoriesPage/AllStoriesPage';
import EditStoryPage from '../Stories/EditStoryPage/EditStoryPage';
import FavouriteStoryPage from '../Stories/FavoriteStoryPage/FavoriteStoryPage';
import ShowStoryPage from '../Stories/ShowStoryPage/ShowStoryPage';
import AuthPage from '../User/AuthPage/AuthPage';
import EditProfilePage from '../User/EditProfilePage/EditProfilePage';
import ProfilePage from '../User/ProfilePage/ProfilePage';

export default function App() {
  const [user, setUser] = useState(getUser());
  return (
    <main className={styles.App}>
      { user ?
        <>
          <Routes>
            {/* client-side route that renders the component instance if the path matches the url in the address bar */}
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
            <Route path="/profile/:id/edit" element={<EditProfilePage user={user} setUser={setUser} />} />
            <Route path="/profile/:id" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="/events" element={<EventRemindersPage user={user} setUser={setUser} />} />
            <Route path="/events/new" element={<AddReminderPage user={user} setUser={setUser} />} />
            <Route path="/events/:id/edit" element={<EditReminderPage user={user} setUser={setUser} />} />
            <Route path="/events/:id" element={<ShowReminderPage user={user} setUser={setUser} />} />
            <Route path="/friends" element={<AllFriendsPage user={user} setUser={setUser} />} />
            <Route path="/friends/new" element={<AddFriendPage user={user} setUser={setUser} />} />
            <Route path="/friends/favourites" element={<FavouriteFriendsPage user={user} setUser={setUser} />} />
            <Route path="/friends/:id/edit" element={<EditFriendPage user={user} setUser={setUser} />} />
            <Route path="/friends/:id" element={<ShowFriendPage user={user} setUser={setUser} />} />
            <Route path="/interactions" element={<AllInteractionsPage user={user} setUser={setUser} />} />
            <Route path="/interactions/new" element={<AddInteractionPage user={user} setUser={setUser} />} />
            <Route path="/interactions/:id/edit" element={<EditInteractionPage user={user} setUser={setUser} />} />
            <Route path="/interactions/:id" element={<ShowInteractionPage user={user} setUser={setUser} />} />
            <Route path="/stories" element={<AllStoriesPage user={user} setUser={setUser} />} />
            <Route path="/stories/new" element={<AddStoryPage user={user} setUser={setUser} />} />
            <Route path="/stories/favourites" element={<FavouriteStoryPage user={user} setUser={setUser} />} />
            <Route path="/stories/:id/edit" element={<EditStoryPage user={user} setUser={setUser} />} />
            <Route path="/stories/:id" element={<ShowStoryPage user={user} setUser={setUser} />} />
            <Route path="/auth" element={<AuthPage user={user} setUser={setUser} />} />

            
            {/* redirect to /orders/new if path in address bar hasn't matched a <Route> above */}
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );
}