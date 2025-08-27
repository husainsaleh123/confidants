import { useState } from 'react';
import styles from './AuthPage.module.scss';
import LoginForm from '../../../components/User/LoginForm/LoginForm';
import SignupForm from '../../../components/User/SignupForm/SignupForm';
import logo from "../../../assets/images/logo.png";
import illustration from "../../../assets/images/signUp.png";
export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

   return (
    <main className={styles.page}>
      {/* Left: Logo + Illustration */}
      <div className={styles.left}>
        <img src={logo} alt="Confidants Logo" className={styles.logo} />
        <img src={illustration} alt="Two people" className={styles.illustration} />
      </div>

      {/* Right: Auth card + toggle */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${showLogin ? styles.active : ""}`}
              onClick={() => setShowLogin(true)}
              aria-pressed={showLogin}
            >
              Log in
            </button>
            <button
              type="button"
              className={`${styles.tab} ${!showLogin ? styles.active : ""}`}
              onClick={() => setShowLogin(false)}
              aria-pressed={!showLogin}
            >
              Sign up
            </button>
          </div>

          <div className={styles.formWrap}>
            {showLogin ? (
              <LoginForm setUser={setUser} />
            ) : (
              <SignupForm setUser={setUser} />
            )}
          </div>

          <div className={styles.switchLine}>
            {showLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => setShowLogin(false)}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => setShowLogin(true)}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
