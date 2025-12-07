'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
}

type UseAuthReturn = AuthState & AuthActions;

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (_error) {
        // Invalid user data, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
    // Force a reload or invalidate queries if needed, but for now state update is enough
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/login');
  };

  return {
    ...state,
    login,
    logout,
  };
}
