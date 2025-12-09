import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { useRouter } from 'next/navigation';

import RegisterPage from './page';
import { server } from '../../test/mocks/server';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// eslint-disable-next-line max-lines-per-function
describe('RegisterPage', () => {
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
    it('should render register form with all elements', () => {
      render(<RegisterPage />);

      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toBeRequired();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toBeRequired();
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toBeRequired();
    });

    it('should show password hint text', () => {
      render(<RegisterPage />);
      expect(screen.getByText(/minimum 8 characters/i)).toBeInTheDocument();
    });

    it('should have link to login page', () => {
      render(<RegisterPage />);
      const loginLink = screen.getByRole('link', { name: /login here/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Successful Registration', () => {
    it('should register successfully with valid data', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      // Fill in form
      await user.type(screen.getByLabelText(/full name/i), 'New User');
      await user.type(screen.getByLabelText(/^email$/i), 'newuser@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Wait for async operations
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });

      // Verify token and user stored in localStorage
      expect(localStorage.getItem('accessToken')).toBe('mock-jwt-token-67890');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser).toEqual({
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
      });
    });

    it('should show loading state during registration', async () => {
      // Add delay to MSW handler to make loading state observable
      server.use(
        http.post('http://localhost:3333/api/auth/register', async ({ request }) => {
          const body = (await request.json()) as { email: string; name: string; password: string };

          // Delay response to make loading state testable
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (body.email === 'newuser@example.com' && body.password === 'password123') {
            return HttpResponse.json(
              {
                user: { id: '2', email: 'newuser@example.com', name: 'New User' },
                accessToken: 'mock-jwt-token-67890',
              },
              { status: 201 }
            );
          }

          return HttpResponse.json(
            { statusCode: 409, message: 'Email already exists', error: 'Conflict' },
            { status: 409 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'New User');
      await user.type(screen.getByLabelText(/^email$/i), 'newuser@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /register/i });

      // Click submit
      await user.click(submitButton);

      // Check loading state appears
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /creating account\.\.\./i })).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/^email$/i)).toBeDisabled();
      expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });

  describe('Failed Registration', () => {
    it('should show error when email already exists', async () => {
      server.use(
        http.post('http://localhost:3333/api/auth/register', () => {
          return HttpResponse.json({ message: 'Email already exists' }, { status: 409 });
        })
      );

      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Existing User');
      await user.type(screen.getByLabelText(/^email$/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should show error when server returns 500', async () => {
      server.use(
        http.post('http://localhost:3333/api/auth/register', () => {
          return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        })
      );

      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Password Validation', () => {
    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password456');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should show error when password is shorter than 8 characters', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'short');
      await user.type(screen.getByLabelText(/confirm password/i), 'short');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should accept exactly 8 character password', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'pass1234');
      await user.type(screen.getByLabelText(/confirm password/i), 'pass1234');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should clear previous error when submitting again', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      // First attempt with mismatched passwords
      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password456');
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      // Clear inputs
      await user.clear(screen.getByLabelText(/full name/i));
      await user.clear(screen.getByLabelText(/^email$/i));
      await user.clear(screen.getByLabelText(/^password$/i));
      await user.clear(screen.getByLabelText(/confirm password/i));

      // Second attempt with matching passwords
      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Wait for success
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });

      // Error should not be visible anymore
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should not allow submission with empty fields due to HTML5 validation', () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/^email$/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

      expect(nameInput.required).toBe(true);
      expect(emailInput.required).toBe(true);
      expect(passwordInput.required).toBe(true);
      expect(confirmPasswordInput.required).toBe(true);
    });

    it('should require valid email format', () => {
      render(<RegisterPage />);

      const emailInput = screen.getByLabelText(/^email$/i) as HTMLInputElement;
      expect(emailInput.type).toBe('email');
    });
  });

  describe('Loading State Management', () => {
    it('should disable all form inputs while loading', async () => {
      server.use(
        http.post('http://localhost:3333/api/auth/register', async ({ request }) => {
          const body = (await request.json()) as { email: string; name: string; password: string };

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json(
              {
                user: { id: '2', email: 'test@example.com', name: 'Test User' },
                accessToken: 'mock-jwt-token-67890',
              },
              { status: 201 }
            );
          }

          return HttpResponse.json(
            { statusCode: 409, message: 'Email already exists', error: 'Conflict' },
            { status: 409 }
          );
        })
      );

      const user = userEvent.setup();
      render(<RegisterPage />);

      await user.type(screen.getByLabelText(/full name/i), 'Test User');
      await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /register/i });
      await user.click(submitButton);

      // All inputs should be disabled during loading
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeDisabled();
      });
      expect(screen.getByLabelText(/^email$/i)).toBeDisabled();
      expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /creating account\.\.\./i })).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });
  });
});
