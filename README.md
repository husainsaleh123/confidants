# Confidants

Confidants is a modern web app for managing your friendships, interactions, stories, and events. It features a clean, responsive UI and smooth navigation, built with React and Vite.

## Overview

Confidants helps users track their social connections, log interactions, share stories, and set reminders for important events. The app is designed for privacy, ease of use, and a fun, engaging experience.

## Features

- **Authentication:** Sign up, log in, and manage your profile (with avatar upload).
- **Friends:** Add, edit, view, and favorite friends. Search and tag friends.
- **Interactions:** Log and view interactions with friends, including types and details.
- **Stories:** Share, view, and favorite stories. Add moods, photos, and tags.
- **Events & Reminders:** Create, edit, and view event reminders. Calendar and recurring options.
- **Modern UI:** Responsive design, modular components, and SCSS styling.


## Sign Up Page

![](https://i.imgur.com/zfQ3MDH.png)

## Tech Stack

- React (functional and class components)
- Vite (fast development/build)
- SCSS Modules
- Node.js/Express (API server)
- MongoDB (database)

## Additionals
- [Team Trello ](https://trello.com/b/sifnZPs9/group-3-team-project)
- [Figma](https://www.figma.com/design/m3PADnv0RCWQnASIjI8Tvz/Untitled?node-id=0-1&t=2jOqmfBh2cISwJFF-1)


## Project Structure

```
confidants/
├── app-server.js           # Express server entry
├── server.js               # Main server file
├── package.json            # Project metadata, dependencies, scripts
├── vite.config.js          # Vite configuration
├── index.html              # HTML template
├── README.md               # Project documentation (this file)
├── config/                 # Server config, middleware, database
│   ├── checkToken.js
│   ├── config.js
│   ├── database.js
│   └── ensureLoggedIn.js
├── controllers/            # API controllers
│   └── api/
│       ├── events.js
│       ├── friends.js
│       ├── interactions.js
│       ├── stories.js
│       └── users.js
├── models/                 # Mongoose models
│   ├── event.js
│   ├── friend.js
│   ├── interaction.js
│   ├── story.js
│   └── user.js
├── public/                 # Static assets
│   └── vite.svg
├── routes/                 # Express routes
│   └── api/
│       ├── events.js
│       ├── friends.js
│       ├── interactions.js
│       ├── stories.js
│       └── users.js
├── src/                    # Frontend source code
│   ├── index.scss          # Global styles
│   ├── main.jsx            # App entry point
│   ├── assets/             # Images
│   │   └── images/
│   │       ├── logo.png
│   │       ├── signUp.png
│   │       └── streakFire.png
│   ├── components/         # UI components
│   │   ├── Button/
│   │   ├── Dropdown/
│   │   ├── Events/
│   │   ├── Footer/
│   │   ├── Friends/
│   │   ├── Home/
│   │   ├── Interactions/
│   │   ├── Modal/
│   │   ├── Navbar/
│   │   ├── NotificationToast/
│   │   ├── SearchBar/
│   │   ├── Stories/
│   │   ├── TagBadge/
│   │   └── User/
│   │       ├── AvatarUploader/
│   │       ├── EditProfileForm/
│   │       ├── LoginForm/
│   │       ├── Logout/
│   │       ├── ProfileInfo/
│   │       ├── SignupForm/
│   │       └── UserSettings/
│   ├── pages/              # Main pages/views
│   │   ├── App/
│   │   ├── AuthPage/
│   │   ├── Events/
│   │   ├── Friends/
│   │   ├── Home/
│   │   ├── Interactions/
│   │   └── Stories/
│   ├── router/             # Frontend routes
│   │   └── routes.js
│   └── utilities/          # API utilities/services
│       ├── events-api.js
│       ├── friends-api.js
│       ├── interaction-api.js
│       ├── send-request.js
│       ├── stories-api.js
│       ├── users-api.js
│       └── users-service.js
```

---

### Created by

   - Husain Alnahash
   - Ali Jawad
   - Mohammed Ali Ahmed Jaber
   - Mahmood Kadhem
   - Husain Folath 
   - Aqeel Muslim  
   

Confidants © All rights reserved 2025.
