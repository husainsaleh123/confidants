// src/components/Footer/Footer.jsx
import { useNavigate } from "react-router-dom";
import { logOut } from '../../utilities/users-service';
export default function Footer({ user, setUser }) {
const navigate = useNavigate();
 function handleLogOut() {
 logOut();
 setUser(null);
 navigate("/"); // always redirect to home after logout
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