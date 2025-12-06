import { render } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import Page from './page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock localStorage
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully when user is authenticated', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
