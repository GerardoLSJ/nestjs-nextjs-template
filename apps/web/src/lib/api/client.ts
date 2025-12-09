/**
 * Custom fetch wrapper for API requests
 * Adds JWT authentication token to all requests
 * Automatically clears expired credentials on 401 responses
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

/**
 * Clears authentication credentials from localStorage and redirects to login
 */
const clearAuthAndRedirect = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Only redirect if not already on login page to avoid redirect loops
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
};

export const customFetch = <T>(url: string, options: RequestInit): Promise<T> => {
  // Prepend base URL if url is relative
  const fullUrl = url.startsWith('/') ? `${API_BASE_URL}${url}` : url;

  // Get JWT token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Add authorization header if token exists
  const headers: HeadersInit = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(fullUrl, {
    ...options,
    headers,
  }).then(async (response) => {
    if (!response.ok) {
      // Handle unauthorized - clear credentials and redirect to login
      if (response.status === 401) {
        clearAuthAndRedirect();
        throw new Error('Session expired. Please log in again.');
      }

      // Extract error details from response
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  });
};
