/**
 * Custom fetch wrapper for API requests
 * Adds JWT authentication token to all requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

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
      // Extract error details from response
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  });
};
