import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useAuth } from './useAuth';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useAuth', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should return unauthenticated state when no token exists', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should return authenticated state when token and user exist', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
  });

  it('should handle invalid user data in localStorage', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('user', 'invalid-json');

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should login successfully and update state', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    result.current.login('new-token', mockUser);

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('new-token');
    expect(localStorage.getItem('accessToken')).toBe('new-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should logout successfully and clear state', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    result.current.logout();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should complete loading and set auth state', async () => {
    const { result } = renderHook(() => useAuth());

    // Hook completes loading synchronously due to localStorage access
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle missing token with existing user data', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    // No token

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle existing token with missing user data', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    // No user

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });
});
