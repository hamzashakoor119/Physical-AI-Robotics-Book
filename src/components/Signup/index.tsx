import React, { useState } from 'react';
import styles from './styles.module.css';
import { getBackendApiPath } from '../../utils/backendUrl';

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onError: (message: string) => void;
}

export default function Signup({ onSuccess, onSwitchToLogin, onError }: SignupProps): React.ReactElement {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    software_experience: '',
    hardware_experience: '',
    robotics_knowledge: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      onError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      onError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getBackendApiPath()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          software_experience: formData.software_experience,
          hardware_experience: formData.hardware_experience,
          robotics_knowledge: formData.robotics_knowledge,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Store token
      localStorage.setItem('auth_token', data.access_token);
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
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
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Min 6 characters"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter password"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="software_experience">Software Experience</label>
          <textarea
            id="software_experience"
            name="software_experience"
            value={formData.software_experience}
            onChange={handleChange}
            placeholder="Describe your software development background (optional)"
            rows={2}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hardware_experience">Hardware Experience</label>
          <textarea
            id="hardware_experience"
            name="hardware_experience"
            value={formData.hardware_experience}
            onChange={handleChange}
            placeholder="Describe your hardware/robotics experience (optional)"
            rows={2}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="robotics_knowledge">Robotics Knowledge</label>
          <textarea
            id="robotics_knowledge"
            name="robotics_knowledge"
            value={formData.robotics_knowledge}
            onChange={handleChange}
            placeholder="What do you know about robotics/physical AI? (optional)"
            rows={2}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className={styles.switchButton}>
          Login
        </button>
      </p>
    </div>
  );
}
