import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * MSW Server for Node.js Test Environment
 *
 * This server runs in Node.js during Jest tests and intercepts
 * HTTP requests made by the frontend code.
 *
 * Usage in tests:
 * - setupTests.ts: Start server before all tests
 * - Individual tests: Override handlers for specific scenarios
 */
export const server = setupServer(...handlers);
