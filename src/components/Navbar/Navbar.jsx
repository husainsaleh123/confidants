// src/components/NavBar/NavBar.jsx
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import logo from "../../assets/images/logo.png"
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
    <nav className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <Link to="/">
          <img src={logo} alt="Confidants Logo" />
        </Link>
      </div>
      <div className={styles.navbar__links}>
        {routes.map(({ key, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={key}
              to={path}
              className={isActive ? `${styles.navbar__link} ${styles.active}` : styles.navbar__link}
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
