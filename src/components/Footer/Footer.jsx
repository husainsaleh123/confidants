// src/components/Footer/Footer.jsx
import { logOut } from '../../utilities/users-service';
export default function Footer({ user, setUser }) {
 function handleLogOut() {
 logOut();
 setUser(null);
}
  return (
    <footer className="footer">
      <span className="footer-copyright">
        Confidants © all rights reserved 2025.
      </span>
      <button className="footer-logout" onClick={handleLogOut}>
        Logout
      </button>
    </footer>
  );
}