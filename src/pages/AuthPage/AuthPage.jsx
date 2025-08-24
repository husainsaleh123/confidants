import { useState } from 'react';
import styles from './AuthPage.module.scss';
import LoginForm from '../../components/User/LoginForm/LoginForm';
import SignupForm from '../../components/User/SignupForm/SignupForm';

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className={styles.AuthPage}>
      <div>
        <Logo />
        <h3 onClick={() => setShowLogin(!showLogin)}>{showLogin ? 'SIGN UP' : 'LOG IN'}</h3>
      </div>
      {showLogin ? <LoginForm setUser={setUser} /> : <SignupForm setUser={setUser} />}
    </main>
  );
}
