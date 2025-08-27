// src/components/NavBar/NavBar.jsx
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ user }) => {
  const location = useLocation();

  const routes = [
    { key: "Home", path: "/" },
    { key: "Events", path: "/events" },
    { key: "Stories", path: "/stories" },
    { key: "Friends", path: "/friends" },
    { key: "Interactions", path: "/interactions" },
    { 
      key: "Profile", 
      path: user && user._id ? `/profile/${user._id}` : "/auth" 
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__links">
        {routes.map(({ key, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={key}
              to={path}
              className={isActive ? "navbar__link active" : "navbar__link"}
            >
              {key}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
