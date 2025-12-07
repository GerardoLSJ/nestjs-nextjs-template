# Testing Context

> **Tokens**: ~1100 | **Triggers**: test, jest, e2e, unit, mock, msw, fixture, playwright

## Overview

Comprehensive testing with Jest (unit), Supertest (API E2E), Playwright (Web E2E), and MSW (API mocking).

## Key Files

**Unit Tests**:
- `apps/api/src/**/*.spec.ts` - API unit tests
- `apps/web/src/**/*.spec.tsx` - Web unit tests
- `jest.config.ts` - Jest configuration

**E2E Tests**:
- `apps/api-e2e/src/**/*.e2e-spec.ts` - API E2E tests
- `apps/web-e2e/src/**/*.spec.ts` - Web E2E tests
- `apps/api-e2e/jest.config.ts` - API E2E config
- `apps/web-e2e/playwright.config.ts` - Playwright config

**Mocking**:
- `apps/web/src/test/mocks/` - MSW handlers and setup
- `apps/web/src/test/polyfills.ts` - Jest polyfills
- `apps/web/src/test/utils.tsx` - Test utilities

## Patterns

### Unit Testing Pattern (Frontend)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    const mockCallback = jest.fn();

    render(<Component onSubmit={mockCallback} />);

    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
```

### Unit Testing Pattern (Backend)

```typescript
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should find user by id', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(mockUser);

    const result = await service.findById('1');

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
```

### E2E Testing Pattern (API)

```typescript
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    authToken = response.body.token;
  });

  it('/api/auth/profile (GET) - authenticated', async () => {
    return request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
});
```

### MSW Setup for Frontend Tests

**Server Setup** (`test/mocks/setup.ts`):

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Handlers** (`test/mocks/handlers.ts`):

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3333/api/events', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json([
      { id: '1', title: 'Test Event', members: 'Alice', dateTime: '2024-01-01T10:00' },
    ]);
  }),
];
```

## Common Operations

### Running Tests

```bash
# All unit tests
npm run test:all

# Specific project
npx nx test api
npx nx test web

# E2E tests
npm run e2e:all
npx nx e2e api-e2e
npx nx e2e web-e2e

# Health check (lint + test + e2e)
npm run health-check
```

### Writing a New Test

1. Create `.spec.ts` (or `.spec.tsx`) file next to source
2. Import necessary testing utilities
3. Set up beforeEach/afterEach hooks
4. Write descriptive test cases
5. Use semantic queries (getByRole, getByLabelText)
6. Test user behavior, not implementation

### Debugging Tests

```bash
# Run single test file
npx nx test api --testFile=user.service.spec.ts

# Run with coverage
npx nx test web --coverage

# Run in watch mode
npx nx test api --watch
```

## Gotchas

### MSW and Jest Environment

**Problem**: Jest doesn't have all Web APIs (Response, TextEncoder, etc.)

**Solution**: Create polyfills file

```typescript
// test/polyfills.ts
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { TransformStream, ReadableStream, WritableStream } from 'stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.TransformStream = TransformStream as any;
global.ReadableStream = ReadableStream as any;
global.WritableStream = WritableStream as any;
```

**Jest Config**:

```typescript
setupFiles: ['<rootDir>/src/test/polyfills.ts'],
transformIgnorePatterns: ['node_modules/(?!(msw)/)'],
```

### Nx Monorepo E2E Tests

**Problem**: E2E tests running during unit test execution

**Solution**: Separate Jest configurations

```typescript
// jest.config.ts (unit tests)
testMatch: [
  '**/__tests__/**/*.[jt]s?(x)',
  '**/?(*.)+(spec|test).[jt]s?(x)',
  '!**/*.e2e-spec.ts', // Exclude E2E
],
```

### macOS Command Execution

**Problem**: Commands fail without proper zsh environment

**Solution**: Source zsh config first

```bash
source ~/.zshrc && npx nx e2e api-e2e
```

### Test Isolation

**Best Practices**:
- Clear mocks in beforeEach: `jest.clearAllMocks()`
- Reset handlers after each test: `server.resetHandlers()`
- Clean up localStorage: `localStorage.clear()`
- Unmount components: `const { unmount } = render(...); unmount()`

## Quick Commands

```bash
npm run test:all       # All unit tests
npm run e2e:all        # All E2E tests
npm run lint:all       # ESLint all projects
npm run health-check   # Full verification
```

## Test Status

**Current** (as of 2025-12-07):
- Total: 126/127 tests passing (99%)
- Web unit: 103 tests
- API unit: 22 tests
- API E2E: 35 tests (including 11 security tests)
- 1 intentionally skipped: clearAllEvents (no-op after API migration)

## Architecture Decisions

**ADR-004**: Separate Jest Configurations for Unit vs E2E
**ADR-009**: MSW for Frontend Testing
**ADR-012**: Skip 2 useEvents Tests (pragmatic decision)
**ADR-018**: Comprehensive Security Test Suite

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [Frontend Module](frontend.md) - Component testing patterns
- [API Module](api.md) - API E2E patterns
- [Security Module](security.md) - Security E2E tests
