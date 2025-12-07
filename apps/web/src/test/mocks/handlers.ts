import type { AuthResponse, LoginDto } from '@auth-tutorial/shared-types';
import { http, HttpResponse } from 'msw';

import type { RegisterDto } from '../../lib/api/generated/models';
import type { Event, CreateEventInput } from '../../types/event.types';

const API_URL = 'http://localhost:3333/api';

// In-memory event store for testing
let mockEvents: Event[] = [];
let eventIdCounter = 1;

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

  // GET /api/events - Get all events for user
  http.get(`${API_URL}/events`, ({ request }) => {
    // Check local storage directly since customFetch adds the header but we might be in a test env where that logic is different
    // Or we can rely on the fact that if we use the generated client with customFetch, it will add the header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For tests using react-query hooks, we might not always have the header if enabled is false
      // But if we're hitting this handler, the request was made
      return HttpResponse.json(
        { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json(mockEvents, { status: 200 });
  }),

  // POST /api/events - Create new event
  http.post(`${API_URL}/events`, async ({ request }) => {
    // Simulating auth check failure if no token is present in the request
    // This relies on the client adding the token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const body = (await request.json()) as CreateEventInput;
      const newEvent: Event = {
        id: `event-${eventIdCounter++}`,
        title: body.title,
        members: body.members,
        datetime: body.datetime,
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    } catch (error) {
      console.error('Handler Error:', error);
      return HttpResponse.json({ message: 'Handler Error', error }, { status: 500 });
    }
  }),

  // DELETE /api/events/:id - Delete event
  http.delete(`${API_URL}/events/:id`, ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const eventIndex = mockEvents.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Event not found', error: 'Not Found' },
        { status: 404 }
      );
    }

    mockEvents.splice(eventIndex, 1);
    return HttpResponse.json({ message: 'Event successfully deleted' }, { status: 200 });
  }),
];

// Helper function to reset mock data (useful for tests)
export const resetMockEvents = () => {
  mockEvents = [];
  eventIdCounter = 1;
};
