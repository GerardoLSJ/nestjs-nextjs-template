import type { AuthResponse, LoginDto, RegisterDto } from '@auth-tutorial/shared-types';
import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3333/api';

/**
 * MSW Request Handlers for API Mocking
 *
 * These handlers intercept HTTP requests during tests and return mock responses.
 * This allows testing frontend logic without running the backend or database.
 */
export const handlers = [
  // POST /api/auth/login - Successful login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginDto;

    // Simulate successful login
    if (body.email === 'test@example.com' && body.password === 'password123') {
      const response: AuthResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        accessToken: 'mock-jwt-token-12345',
      };
      return HttpResponse.json(response, { status: 200 });
    }

    // Simulate invalid credentials
    return HttpResponse.json(
      {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }),

  // POST /api/auth/register - Successful registration
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterDto;

    // Simulate email already exists
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        {
          statusCode: 409,
          message: 'User with this email already exists',
          error: 'Conflict',
        },
        { status: 409 }
      );
    }

    // Simulate validation error (password too short)
    if (body.password.length < 6) {
      return HttpResponse.json(
        {
          statusCode: 400,
          message: 'Validation failed',
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    // Simulate successful registration
    const response: AuthResponse = {
      user: {
        id: '2',
        email: body.email,
        name: body.name,
      },
      accessToken: 'mock-jwt-token-67890',
    };
    return HttpResponse.json(response, { status: 201 });
  }),
];
