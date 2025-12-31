import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function AuthButton({ onOpenAuthModal }: { onOpenAuthModal: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoggedIn(true);
      // Decode JWT to get email (simple decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.sub || '');
      } catch (e) {
        console.error('Failed to decode token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserEmail('');
    window.location.reload();
  };

  if (isLoggedIn) {
    return (
      <div className={styles.authContainer}>
        <span className={styles.userEmail}>{userEmail}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={onOpenAuthModal} className={styles.loginButton}>
      Login / Sign Up
    </button>
  );
}
