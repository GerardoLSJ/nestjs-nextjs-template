import '@testing-library/jest-dom';
import { server } from './mocks/server';

/**
 * Global Test Setup for Web Application
 *
 * This file runs once before all tests and sets up:
 * 1. MSW server for API mocking
 * 2. Jest-DOM matchers for better assertions
 * 3. Global test cleanup
 * 4. Polyfills for fetch, TextEncoder, TextDecoder
 */

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // Warn about requests that don't have handlers
  });
});

// Reset handlers after each test to ensure test isolation
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});

// Mock window.matchMedia (not available in Jest environment)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
