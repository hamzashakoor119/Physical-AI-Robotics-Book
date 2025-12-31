import React, { useState, useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import NavbarContent from '@theme-original/NavbarContent';
import AuthModal from '@site/src/components/AuthModal';

export default function NavbarContentWrapper(): JSX.Element {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Only access localStorage on client side
    if (ExecutionEnvironment.canUseDOM) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(payload.sub || '');
        } catch (e) {
          console.error('Failed to decode token');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserEmail('');
    window.location.reload();
  };

  // Don't render auth button until mounted to avoid SSR issues
  if (!isMounted) {
    return <NavbarContent />;
  }

  return (
    <>
      <NavbarContent />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginRight: '10px' }}>
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: '13px', color: 'var(--ifm-font-color-secondary)', marginRight: '10px' }}>
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'var(--ifm-color-emphasis-200)',
                color: 'var(--ifm-color-emphasis-800)',
                padding: '6px 12px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Login / Sign Up
          </button>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
