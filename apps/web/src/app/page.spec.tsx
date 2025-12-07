import { screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import Page from './page';
import { renderWithQueryClient } from '../test/utils';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  // Mock window.location.href assignment for tests
  redirect: jest.fn(),
}));

// Mock useAuth return value for this page's smoke test.
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    },
    token: 'mock-token',
    isLoading: false,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock useEvents to prevent loading state
jest.mock('../hooks/useEvents', () => ({
  useEvents: () => ({
    events: [],
    isLoading: false,
    error: null,
    createEvent: jest.fn(),
    deleteEvent: jest.fn(),
    clearAllEvents: jest.fn(),
    refetch: jest.fn(),
  }),
}));

describe('Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    // Explicitly mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'accessToken') return 'mock-token';
          if (key === 'user')
            return JSON.stringify({
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
            });
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully when user is authenticated', () => {
    const { baseElement } = renderWithQueryClient(<Page />);
    expect(baseElement).toBeTruthy();
    expect(screen.getByRole('heading', { name: /welcome, test user/i })).toBeInTheDocument();
  });
});
