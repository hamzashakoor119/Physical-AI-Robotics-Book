import React, { useState } from 'react';
import styles from './styles.module.css';
import Login from '../Login';
import Signup from '../Signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    setError(null);
    onClose();
    // Reload page to update UI
    window.location.reload();
  };

  const handleError = (message: string) => {
    setError(message);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>

        {error && (
          <div className={styles.errorBanner}>
            {error}
            <button onClick={() => setError(null)} className={styles.dismissError}>×</button>
          </div>
        )}

        {mode === 'login' ? (
          <Login
            onSuccess={handleSuccess}
            onSwitchToSignup={() => { setMode('signup'); setError(null); }}
            onError={handleError}
          />
        ) : (
          <Signup
            onSuccess={handleSuccess}
            onSwitchToLogin={() => { setMode('login'); setError(null); }}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
