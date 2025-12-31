import React, { useState } from 'react';
import styles from './styles.module.css';
import { getBackendApiPath } from '../../utils/backendUrl';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onError: (message: string) => void;
}

export default function Login({ onSuccess, onSwitchToSignup, onError }: LoginProps): React.ReactElement {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${getBackendApiPath()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors (array) or string error messages
        let errorMessage = 'Login failed';
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((e: { msg?: string }) => e.msg || 'Validation error').join(', ');
        }
        throw new Error(errorMessage);
      }

      // Store token
      localStorage.setItem('auth_token', data.access_token);
      onSuccess();
    } catch (error) {
      // Show actual error message
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className={styles.switchButton}>
          Sign Up
        </button>
      </p>
    </div>
  );
}
