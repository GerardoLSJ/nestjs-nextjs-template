import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should show loading state when authentication is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show custom loading component when provided', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute loadingComponent={<div>Custom Loading...</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect during loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle transition from loading to unauthenticated', async () => {
    const { rerender } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Start with loading
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Transition to unauthenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle transition from loading to authenticated', () => {
    // Start with loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { rerender } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Transition to authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
