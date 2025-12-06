import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { useRouter } from 'next/navigation';

import LoginPage from './page';
import { server } from '../../test/mocks/server';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// eslint-disable-next-line max-lines-per-function
describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorage.clear();

    // Setup useRouter mock
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(<LoginPage />);

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/hint:/i)).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Successful Login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // Fill in form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for async operations
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });

      // Verify token and user stored in localStorage
      expect(localStorage.getItem('accessToken')).toBe('mock-jwt-token-12345');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should show loading state during login', async () => {
      // Add delay to MSW handler to make loading state observable
      server.use(
        http.post('http://localhost:3333/api/auth/login', async ({ request }) => {
          const body = (await request.json()) as { email: string; password: string };

          // Delay response to make loading state testable
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json(
              {
                user: { id: '1', email: 'test@example.com', name: 'Test User' },
                accessToken: 'mock-jwt-token-12345',
              },
              { status: 200 }
            );
          }

          return HttpResponse.json(
            { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' },
            { status: 401 }
          );
        })
      );

      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /login/i });

      // Click submit
      await user.click(submitButton);

      // Check loading state appears
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logging in\.\.\./i })).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('Failed Login', () => {
    it('should show error message with invalid credentials', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // Fill in wrong credentials
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

      // Submit form
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Verify no redirect happened
      expect(mockPush).not.toHaveBeenCalled();

      // Verify no data stored in localStorage
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should show error when server returns 500', async () => {
      // Override the login handler to return 500 error
      server.use(
        http.post('http://localhost:3333/api/auth/login', () => {
          return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        })
      );

      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should clear previous error when submitting again', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // First attempt with wrong credentials
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Clear inputs
      await user.clear(screen.getByLabelText(/email/i));
      await user.clear(screen.getByLabelText(/password/i));

      // Second attempt with correct credentials
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for success
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });

      // Error should not be visible anymore
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should not allow submission with empty fields due to HTML5 validation', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      // Check that inputs are required (HTML5 validation)
      expect(emailInput.required).toBe(true);
      expect(passwordInput.required).toBe(true);
    });

    it('should require valid email format', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailInput.type).toBe('email'); // HTML5 email validation
    });
  });

  describe('Loading State Management', () => {
    it('should disable form inputs while loading', async () => {
      // Add delay to MSW handler to make loading state observable
      server.use(
        http.post('http://localhost:3333/api/auth/login', async ({ request }) => {
          const body = (await request.json()) as { email: string; password: string };

          // Delay response to make loading state testable
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json(
              {
                user: { id: '1', email: 'test@example.com', name: 'Test User' },
                accessToken: 'mock-jwt-token-12345',
              },
              { status: 200 }
            );
          }

          return HttpResponse.json(
            { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' },
            { status: 401 }
          );
        })
      );

      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      // Inputs should be disabled during loading
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeDisabled();
      });
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /logging in\.\.\./i })).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });
});
