import React, { Suspense, lazy, useState, useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AuthModal from '@site/src/components/AuthModal';

// Lazy load ChatWidget to prevent blocking the main app
const ChatWidget = lazy(() => import('@site/src/components/ChatWidget'));

// Helper to get backend URL
function getBackendUrl(): string {
  // For production: set BACKEND_URL in docusaurus.config.ts customFields
  // For development: defaults to localhost
  if (typeof window !== 'undefined') {
    // Check for custom field from Docusaurus config
    const docusaurusConfig = (window as any).__DOCUSAURUS__;
    const customBackendUrl = docusaurusConfig?.siteConfig?.customFields?.BACKEND_URL;
    if (customBackendUrl) {
      return customBackendUrl as string;
    }
  }
  // Default to localhost for development
  return 'http://localhost:8000/api';
}

interface RootProps {
  children: React.ReactNode;
}

// Error boundary to catch ChatWidget errors without crashing the whole app
class ChatWidgetErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ChatWidget Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't show anything if ChatWidget crashes
    }
    return this.props.children;
  }
}

// Auth Button Component
function AuthButtonInNavbar() {
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
  if (!isMounted) return null;

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginRight: '10px'
      }}>
        {isLoggedIn ? (
          <>
            <span style={{
              fontSize: '13px',
              color: 'var(--ifm-font-color-secondary)',
              marginRight: '10px',
              whiteSpace: 'nowrap'
            }}>
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
              whiteSpace: 'nowrap'
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

// Component to inject auth button into navbar
function InjectAuthButton() {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const injectAuthButton = () => {
      const navbar = document.querySelector('.navbar__items--right');
      if (navbar && !document.querySelector('.auth-button-container')) {
        const authContainer = document.createElement('div');
        authContainer.className = 'auth-button-container';
        authContainer.style.cssText = 'display: flex; align-items: center; margin-left: 10px;';
        navbar.appendChild(authContainer);

        // Create a React root for the auth button
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(authContainer);
          root.render(<AuthButtonInNavbar />);
        });
      }
    };

    // Try to inject immediately and also on navigation
    injectAuthButton();

    // MutationObserver to detect when navbar changes
    const observer = new MutationObserver(() => {
      injectAuthButton();
    });

    const navbarElement = document.querySelector('nav.navbar');
    if (navbarElement) {
      observer.observe(navbarElement, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

export default function Root({ children }: RootProps): JSX.Element {
  const backendUrl = getBackendUrl();

  return (
    <>
      {children}
      <InjectAuthButton />
      <ChatWidgetErrorBoundary>
        <Suspense fallback={null}>
          <ChatWidget apiEndpoint={backendUrl} />
        </Suspense>
      </ChatWidgetErrorBoundary>
    </>
  );
}
