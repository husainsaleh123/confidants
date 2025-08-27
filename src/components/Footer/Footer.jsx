import { useNavigate } from "react-router-dom";
import { logOut } from "../../utilities/users-service";
import styles from "./Footer.module.scss";

export default function Footer({ setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate("/");
  }

  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>
        Confidants © all rights reserved 2025.
      </span>
      <button className={styles.logoutBtn} onClick={handleLogOut}>
        Logout
      </button>
    </footer>
  );
}
