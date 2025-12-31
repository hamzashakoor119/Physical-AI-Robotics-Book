/**
 * Utility to get backend URL consistently across all components
 *
 * For production: set BACKEND_URL in docusaurus.config.ts customFields
 * For development: defaults to localhost:8000
 */

export function getBackendUrl(): string {
  // For production: check custom field from Docusaurus config
  if (typeof window !== 'undefined') {
    const docusaurusConfig = (window as any).__DOCUSAURUS__;
    const customBackendUrl = docusaurusConfig?.siteConfig?.customFields?.BACKEND_URL;
    if (customBackendUrl) {
      return customBackendUrl as string;
    }
  }

  // Default to localhost for development
  return 'http://localhost:8000/api';
}

export function getBackendApiPath(): string {
  // Remove trailing /api from backend URL for API calls
  const baseUrl = getBackendUrl();
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}`;
}
