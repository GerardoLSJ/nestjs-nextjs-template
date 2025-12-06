# Architecture Documentation

## Project Philosophy

### Core Principles

1. **Monorepo Organization** - Use Nx to manage multiple related applications and libraries in a single repository, enabling code sharing and unified tooling.

2. **Type Safety First** - Leverage TypeScript throughout the stack with shared type definitions to catch errors at compile time and improve developer experience.

3. **Developer Experience** - Prioritize fast feedback loops through hot reloading, comprehensive testing, and automated quality checks.

4. **Testability** - Every layer should be easily testable with unit tests, integration tests, and E2E tests.

5. **Separation of Concerns** - Clear boundaries between API, Web, and shared libraries with well-defined interfaces.

6. **Convention Over Configuration** - Follow established patterns and best practices from NestJS and Next.js to reduce cognitive load.

7. **API-First Design** - Treat the API as a first-class citizen with comprehensive documentation (Swagger/OpenAPI).

8. **Incremental Adoption** - Start simple and add complexity only when needed. The architecture should support growth without requiring major rewrites.

## Architecture Overview

### Technology Stack

#### Backend (API)

- **Framework**: NestJS 11.x
  - Rationale: Enterprise-grade Node.js framework with built-in dependency injection, modularity, and TypeScript support
- **Runtime**: Node.js 20.x+
- **Documentation**: Swagger/OpenAPI
  - Rationale: Auto-generated, interactive API documentation
- **Validation**: class-validator + class-transformer
  - Rationale: Declarative validation with decorators, type-safe transformations

#### Frontend (Web)

- **Framework**: Next.js 16.x (App Router)
  - Rationale: React framework with SSR, SSG, and excellent DX
- **UI Library**: React 19.x
- **Styling**: CSS Modules
  - Rationale: Scoped styles, no global conflicts, component-level styling
- **Layout**: Mobile-first responsive design
  - Fixed header and bottom navigation
  - Safe area insets for iOS notch/home indicator
  - Authentication-aware layout rendering

#### Shared Libraries

- **shared-types**: Common TypeScript interfaces, types, and DTOs used across API and Web

#### Development Tools

- **Monorepo**: Nx 22.x
  - Rationale: Powerful build system with intelligent caching and task orchestration
- **Linting**: ESLint with TypeScript support, security rules, and import management
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
  - Rationale: Enforce code quality before commits
- **Commit Convention**: Commitlint with conventional commits
  - Rationale: Standardized commit messages for changelog generation
  - See [HOW_TO_COMMIT.md](./HOW_TO_COMMIT.md) for detailed commit guidelines

#### Testing

- **Unit Tests**: Jest 30.x + React Testing Library
- **Integration Tests**: Jest with supertest (API), Jest with MSW (Web)
- **E2E Tests**: Playwright (Web - future), Jest (API - current)
- **API Mocking**: MSW (Mock Service Worker) for frontend tests

### Project Structure

```
auth-tutorial/
├── apps/
│   ├── api/                    # NestJS REST API
│   │   ├── src/
│   │   │   ├── auth/          # Auth feature module
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── guards/    # Auth guards (JWT, etc.)
│   │   │   │   ├── strategies/ # Passport strategies
│   │   │   │   ├── decorators/ # Custom decorators (@CurrentUser)
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.service.spec.ts     # ✅ Unit tests (mocked DB)
│   │   │   │   ├── auth.e2e-spec.ts         # ✅ E2E tests (real DB)
│   │   │   │   └── auth.module.ts
│   │   │   ├── database/      # Database module (Prisma)
│   │   │   │   ├── prisma.service.ts
│   │   │   │   └── database.module.ts
│   │   │   ├── app/           # Root application module
│   │   │   │   ├── app.controller.ts
│   │   │   │   ├── app.service.ts
│   │   │   │   └── app.module.ts
│   │   │   └── main.ts        # Application entry point
│   │   ├── prisma/            # Prisma schema & migrations
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── jest.config.ts     # Unit test configuration (excludes *.e2e-spec.ts)
│   │   ├── jest.e2e.config.ts # E2E test configuration (only *.e2e-spec.ts)
│   │   ├── project.json       # Nx project configuration
│   │   └── webpack.config.js  # Webpack configuration for build
│   ├── api-e2e/               # [DEPRECATED] Moved to apps/api/src/**/*.e2e-spec.ts
│   ├── web/                   # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   │   ├── login/     # Login page
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── page.spec.tsx     # ✅ Component tests (11 comprehensive tests)
│   │   │   │   │   └── login.module.css
│   │   │   │   ├── profile/   # User profile page
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── profile.module.css
│   │   │   │   ├── add/       # Create new item page
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── add.module.css
│   │   │   │   ├── page.tsx       # ✅ Home page with event planner
│   │   │   │   ├── page.spec.tsx  # ✅ Component tests (1 test passing)
│   │   │   │   ├── page.module.css
│   │   │   │   └── layout.tsx     # Root layout with LayoutWrapper
│   │   │   ├── components/    # ✅ Reusable UI components
│   │   │   │   ├── layout/    # Mobile layout components
│   │   │   │   │   ├── MobileLayout.tsx         # ✅ Main layout orchestrator
│   │   │   │   │   ├── MobileLayout.spec.tsx    # ✅ 10 tests passing
│   │   │   │   │   ├── MobileLayout.module.css
│   │   │   │   │   ├── LayoutWrapper.tsx        # ✅ Auth-aware layout router
│   │   │   │   │   ├── Header/
│   │   │   │   │   │   ├── Header.tsx           # ✅ Fixed top header
│   │   │   │   │   │   ├── Header.spec.tsx      # ✅ 8 tests passing
│   │   │   │   │   │   └── Header.module.css
│   │   │   │   │   ├── BottomNavigation/
│   │   │   │   │   │   ├── BottomNavigation.tsx # ✅ Floating bottom nav
│   │   │   │   │   │   ├── BottomNavigation.spec.tsx # ✅ 8 tests passing
│   │   │   │   │   │   └── BottomNavigation.module.css
│   │   │   │   │   └── icons/
│   │   │   │   │       ├── HomeIcon.tsx
│   │   │   │   │       ├── PlusIcon.tsx
│   │   │   │   │       ├── UserIcon.tsx
│   │   │   │   │       └── MenuIcon.tsx
│   │   │   │   └── **/*.spec.tsx  # Component tests
│   │   │   ├── components/    # ✅ Reusable UI components
│   │   │   │   ├── auth/      # ✅ Authentication components
│   │   │   │   │   ├── ProtectedRoute.tsx        # ✅ Route protection wrapper
│   │   │   │   │   └── ProtectedRoute.spec.tsx   # ✅ 7 tests passing
│   │   │   │   ├── events/     # ✅ Event planner components
│   │   │   │   │   ├── EventForm.tsx             # ✅ Event creation form
│   │   │   │   │   ├── EventForm.spec.tsx        # ✅ 21 tests passing
│   │   │   │   │   ├── EventForm.module.css
│   │   │   │   │   ├── EventList.tsx             # ✅ Event list display
│   │   │   │   │   ├── EventList.spec.tsx        # ✅ 29 tests passing
│   │   │   │   │   └── EventList.module.css
│   │   │   │   └── layout/    # Mobile layout components (see above)
│   │   │   ├── lib/           # Utilities & API client
│   │   │   │   ├── queryClient.ts
│   │   │   │   ├── api-client.ts      # [FUTURE] Type-safe API client
│   │   │   │   └── **/*.spec.ts       # Unit tests
│   │   │   ├── hooks/         # ✅ Custom React hooks
│   │   │   │   ├── useAuth.ts         # ✅ Authentication state management
│   │   │   │   ├── useAuth.spec.ts    # ✅ 8 tests passing
│   │   │   │   ├── useEvents.ts       # ✅ Event management (localStorage-based)
│   │   │   │   └── useEvents.spec.ts  # ✅ 8 tests passing (2 skipped)
│   │   │   ├── types/          # ✅ TypeScript type definitions
│   │   │   │   └── event.types.ts     # ✅ Event data model (Event, CreateEventInput)
│   │   │   └── test/          # ✅ Test utilities & mocks
│   │   │       ├── mocks/
│   │   │       │   ├── handlers.ts    # ✅ MSW request handlers (login, register)
│   │   │       │   └── server.ts      # ✅ MSW server setup (Node.js)
│   │   │       ├── polyfills.ts       # ✅ Essential polyfills (fetch, TextEncoder, etc)
│   │   │       ├── utils.tsx          # ✅ Test helpers (renderWithQueryClient, etc.)
│   │   │       └── setup.ts           # ✅ Global test setup (MSW lifecycle)
│   │   ├── jest.config.ts     # Test configuration
│   │   └── project.json
│   └── web-e2e/               # [FUTURE] Web E2E tests (Playwright)
│       ├── src/
│       │   ├── login.spec.ts      # Login flow E2E tests
│       │   ├── register.spec.ts   # Registration flow E2E tests
│       │   └── protected-routes.spec.ts
│       └── playwright.config.ts
├── libs/
│   └── shared-types/          # Shared TypeScript definitions
│       └── src/lib/
│           └── auth.types.ts  # Auth-related types
└── packages/                  # Additional packages (future use)
```

### Design Patterns

#### API Layer (NestJS)

1. **Module-Based Architecture**

   - Each feature is encapsulated in a module
   - Modules declare their dependencies explicitly
   - Clear separation of concerns: Controller → Service → Repository

2. **Dependency Injection**

   - Constructor-based injection for all dependencies
   - Promotes testability and loose coupling

3. **DTO Pattern**

   - Use DTOs for request validation and response serialization
   - Separate internal models from API contracts

4. **Controller-Service Pattern**

   - Controllers handle HTTP concerns (routing, validation)
   - Services contain business logic
   - Services are reusable across controllers

5. **Decorator-Based Configuration**
   - Leverage NestJS and class-validator decorators
   - Reduces boilerplate while maintaining clarity

#### Frontend Layer (Next.js)

1. **App Router Architecture**

   - Server Components by default for better performance
   - Client Components only when needed (interactivity)

2. **Component Composition**

   - Small, focused, reusable components
   - Props drilling minimized through proper component hierarchy
   - Layout components for consistent mobile UX

3. **Mobile-First Layout Pattern**

   - MobileLayout orchestrator with conditional rendering
   - Authentication-aware routing (no layout on /login, /register)
   - Fixed header (60px) and bottom navigation (70px)
   - Safe area insets for iOS notch/home indicator
   - Active state indication for current route

4. **API Integration**
   - Centralized API client with type-safe requests
   - Shared types from `@auth-tutorial/shared-types`

### Communication Patterns

#### API ↔ Web Communication

- RESTful HTTP/JSON
- Type-safe contracts using shared-types library
- API documentation via Swagger UI (http://localhost:3333/api/docs)

#### Type Sharing Strategy

```typescript
// libs/shared-types/src/lib/shared-types.ts
export interface ExampleDto {
  id: string;
  name: string;
}

// API usage
import { ExampleDto } from '@auth-tutorial/shared-types';

// Web usage
import { ExampleDto } from '@auth-tutorial/shared-types';
```

## Development Workflow

### Local Development

1. **Install dependencies**: `npm install`
2. **Start all services**: `npm run dev:all`

   - API: http://localhost:3333/api
   - API Docs: http://localhost:3333/api/docs
   - Web: http://localhost:3000

3. **Quality checks**:
   - Linting: `npm run lint:all`
   - Unit tests: `npm run test:all`
   - E2E tests: `npm run e2e:all`
   - Full health check: `npm run health-check`

### Code Quality Gates

Pre-commit hooks enforce:

- ESLint passes on staged files
- Prettier formats staged files
- Conventional commit message format (see [HOW_TO_COMMIT.md](./HOW_TO_COMMIT.md))

### Testing Strategy

This project uses a **layered testing strategy** to balance speed, confidence, and maintainability. Tests are organized by speed and isolation level, with clear guidelines on what to test at each layer.

#### Test Pyramid Overview

```
          /\
         /  \  E2E Tests (Slow, High Confidence)
        /────\
       /      \  Integration Tests (Moderate, Good Coverage)
      /────────\
     /          \  Unit Tests (Fast, Isolated)
    /────────────\
```

---

#### Backend (API) Testing Strategy

##### 1. Unit Tests (`*.spec.ts`) - **CURRENT IMPLEMENTATION** ✅

**Purpose**: Test business logic in isolation with mocked dependencies

**Tools**: Jest, mocked PrismaService, mocked JwtService, mocked bcrypt

**Location**: Colocated with source files (e.g., `auth.service.spec.ts`)

**What to Test**:

- Service methods with mocked database
- Business logic and data transformations
- Error handling and edge cases
- Validation logic

**Example**: [apps/api/src/auth/auth.service.spec.ts](apps/api/src/auth/auth.service.spec.ts)

- ✅ 10/10 tests passing
- ✅ Tests registration logic, login logic, validation
- ✅ All dependencies mocked (PrismaService, JwtService, bcrypt)
- ✅ Fast execution (~2s for all tests)

**Command**: `npx nx test api`

##### 2. E2E Tests (`*.e2e-spec.ts`) - **CURRENT IMPLEMENTATION** ✅

**Purpose**: Test API endpoints with real HTTP requests and real database

**Tools**: Jest, supertest, real PostgreSQL database

**Location**: Colocated with modules (e.g., `auth.e2e-spec.ts`)

**What to Test**:

- Complete HTTP request/response cycle
- Database operations (create, read, update, delete)
- Authentication and authorization flows
- API contract compliance (status codes, response shapes)
- Real validation behavior

**Example**: [apps/api/src/auth/auth.e2e-spec.ts](apps/api/src/auth/auth.e2e-spec.ts)

- ✅ 6/6 tests passing
- ✅ Tests registration, login, validation errors
- ✅ Uses real database (requires `docker-compose up -d`)
- ✅ Creates unique users per test run to avoid conflicts

**Setup Required**:

```bash
docker-compose up -d              # Start PostgreSQL
cd apps/api && npx prisma migrate dev  # Apply migrations
npx nx run api:e2e                # Run E2E tests
```

**Command**: `npx nx run api:e2e`

##### 3. Integration Tests (API Layer) - **NOT YET IMPLEMENTED** ⚠️

**Note**: For this project, E2E tests with real database provide sufficient integration testing. Adding a separate integration test layer with mocked database would be redundant and add complexity without significant value.

**Recommendation**: ❌ **Skip this layer** - E2E tests already cover API integration scenarios

---

#### Frontend (Web) Testing Strategy

##### 1. Unit Tests (`*.spec.ts`) - **PARTIALLY IMPLEMENTED** ⚠️

**Purpose**: Test utilities, helpers, and pure functions in isolation

**Tools**: Jest

**Location**: `apps/web/src/lib/**/*.spec.ts`

**What to Test**:

- Pure utility functions
- Data transformations
- Helper functions
- Validation logic

**Current Status**:

- ⚠️ No utility tests yet (no complex utilities to test)

**Recommendation**: ✅ **Add as needed** - Only create when complex utilities exist

##### 2. Component Tests (`*.spec.tsx`) - **CURRENT IMPLEMENTATION** ✅

**Purpose**: Test React components in isolation without API dependencies

**Tools**: Jest, React Testing Library, MSW (for API mocking)

**Location**: Colocated with components (e.g., `page.spec.tsx`)

**What to Test**:

- Component rendering with different props
- User interactions (clicks, form inputs)
- Conditional rendering
- Component state changes
- Error states and loading states

**Current Status**:

- ✅ MSW infrastructure fully implemented
- ✅ [apps/web/src/test/mocks/handlers.ts](apps/web/src/test/mocks/handlers.ts) - API request handlers
- ✅ [apps/web/src/test/mocks/server.ts](apps/web/src/test/mocks/server.ts) - MSW server setup
- ✅ [apps/web/src/test/utils.tsx](apps/web/src/test/utils.tsx) - QueryClient wrapper
- ✅ [apps/web/src/test/setup.ts](apps/web/src/test/setup.ts) - Global test setup
- ✅ [apps/web/src/test/polyfills.ts](apps/web/src/test/polyfills.ts) - Essential polyfills
- ✅ [apps/web/src/app/login/page.spec.tsx](apps/web/src/app/login/page.spec.tsx) - 11 comprehensive tests
- ✅ [apps/web/src/components/layout/Header/Header.spec.tsx](apps/web/src/components/layout/Header/Header.spec.tsx) - 8 comprehensive tests
- ✅ [apps/web/src/components/layout/BottomNavigation/BottomNavigation.spec.tsx](apps/web/src/components/layout/BottomNavigation/BottomNavigation.spec.tsx) - 8 comprehensive tests
- ✅ [apps/web/src/components/layout/MobileLayout.spec.tsx](apps/web/src/components/layout/MobileLayout.spec.tsx) - 10 comprehensive tests
- ✅ [apps/web/src/hooks/useAuth.spec.ts](apps/web/src/hooks/useAuth.spec.ts) - 8 comprehensive tests
- ✅ [apps/web/src/components/auth/ProtectedRoute.spec.tsx](apps/web/src/components/auth/ProtectedRoute.spec.tsx) - 7 comprehensive tests
- ⚠️ [apps/web/src/app/page.spec.tsx](apps/web/src/app/page.spec.tsx:44-48) - Basic smoke test only

**Test Coverage**:

- ✅ 52/52 total web tests passing (~7.2s execution)
- ✅ 11/11 login page tests passing
- ✅ 26/26 layout component tests passing (Header, BottomNav, MobileLayout)
- ✅ 8/8 useAuth hook tests passing (state management, login, logout)
- ✅ 7/7 ProtectedRoute component tests passing (auth redirect, loading states)
- ✅ Form rendering and validation
- ✅ User interactions (typing, clicking)
- ✅ Successful login flow (authentication, redirect, localStorage)
- ✅ Failed login scenarios (invalid credentials, server errors)
- ✅ Loading state management
- ✅ Error handling and display
- ✅ Mobile layout components (Header, BottomNavigation, MobileLayout)
- ✅ Authentication-aware layout rendering
- ✅ Protected route components with auth hooks
- ✅ Active state navigation indication
- ✅ Component prop variations and edge cases

**Example**:

```typescript
// apps/web/src/app/login/page.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import LoginPage from './page';
import { server } from '../../test/mocks/server';

describe('LoginPage', () => {
  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
    expect(localStorage.getItem('accessToken')).toBe('mock-jwt-token-12345');
  });
});
```

**Benefits Achieved**:

- ✅ Test frontend without running backend
- ✅ Test error scenarios easily
- ✅ Test loading states
- ✅ No database required for frontend tests
- ✅ Fast test execution (~7s for all web tests)
- ✅ Deterministic test results

**Recommendation**: ✅ **Maintain and expand** - Add tests for new pages/components as they're created

**Command**: `npx nx test web`

##### 3. Hook Tests (`hooks/**/*.spec.ts`) - **CURRENT IMPLEMENTATION** ✅

**Purpose**: Test custom React hooks in isolation

**Tools**: Jest, @testing-library/react-hooks (renderHook)

**What to Test**:

- Hook state management and updates
- Side effects (localStorage, API calls)
- Hook return values and methods
- Edge cases and error handling

**Current Status**:

- ✅ useAuth hook implemented and tested (8/8 tests passing)
- ✅ Tests cover authentication state, login, logout, error handling
- ✅ Tests verify localStorage persistence and recovery

**Recommendation**: ✅ **Maintain and expand** - Add tests for additional custom hooks

**Example**:

```typescript
// apps/web/src/hooks/useAuth.spec.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { wrapper } from '../test/utils';

describe('useAuth', () => {
  it('should return authenticated user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
```

##### 4. Integration Tests (Frontend) - **COVERED BY COMPONENT TESTS** ✅

**Note**: Component tests with MSW already provide integration testing for frontend. They test components + TanStack Query + API mocking together.

**Recommendation**: ❌ **Skip separate integration layer** - Component tests with MSW are sufficient

##### 5. E2E Tests (`apps/web-e2e/**/*.spec.ts`) - **NOT YET IMPLEMENTED** ⚠️

**Purpose**: Test complete user flows in real browser

**Tools**: Playwright

**What to Test**:

- Critical user journeys (login → register → protected routes)
- Multi-page flows
- Real browser behavior (navigation, cookies, localStorage)
- Visual regressions (optional)

**Current Status**:

- ⚠️ `apps/web-e2e/` project exists but has no tests

**Recommendation**: ⏰ **Low Priority - Add Later**

**Rationale**:

- API E2E tests already validate backend functionality
- Component tests with MSW validate frontend logic
- Playwright E2E tests are slow and brittle
- Best suited for critical flows after feature completion

**When to Add**:

- After Phase 3 (Polish & Production)
- When testing cross-browser compatibility
- When testing complex multi-step flows
- For regression testing before releases

**Example**:

```typescript
// apps/web-e2e/src/login-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete authentication flow', async ({ page }) => {
  // Register
  await page.goto('http://localhost:3000/register');
  await page.fill('[name="email"]', 'newuser@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.fill('[name="name"]', 'New User');
  await page.click('button[type="submit"]');

  // Verify redirect to home
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.locator('text=Welcome, New User')).toBeVisible();

  // Logout
  await page.click('text=Logout');
  await expect(page).toHaveURL('http://localhost:3000/login');
});
```

**Command**: `npx nx run web-e2e:e2e`

---

#### Contract Testing - **PARTIALLY IMPLEMENTED** ✅

**Purpose**: Ensure API and Frontend agree on data structures

**Current Implementation**:

- ✅ Shared types in `libs/shared-types/src/lib/auth.types.ts`
- ✅ Both API and Web import same types
- ✅ TypeScript compiler enforces contract

**Future Enhancement** ⏰:

- Consider Orval for auto-generating API client from OpenAPI spec
- Generates TypeScript types + React Query hooks automatically
- Reduces manual type maintenance

**Recommendation**: ⏰ **Add in Phase 2** - After contract-first development is established

---

#### Testing Gaps Summary

| Test Type                           | Status | Priority | Recommendation                                            |
| ----------------------------------- | ------ | -------- | --------------------------------------------------------- |
| **Backend Unit Tests**              | ✅     | -        | Implemented, keep maintaining                             |
| **Backend E2E Tests**               | ✅     | -        | Implemented, keep maintaining                             |
| **Backend Integration Tests**       | ⚠️     | ❌ Skip  | E2E tests provide sufficient coverage                     |
| **Frontend Unit Tests (Utils)**     | ⚠️     | ⏰ Later | Add when complex utilities exist                          |
| **Frontend Component Tests**        | ✅     | -        | **Implemented with MSW** - Maintain and expand            |
| **Frontend Hook Tests**             | ⚠️     | ⏰ Later | Add when custom hooks are created                         |
| **Frontend Integration Tests**      | ⚠️     | ❌ Skip  | Component tests with MSW are sufficient                   |
| **Frontend E2E Tests (Playwright)** | ⚠️     | ⏰ Later | Add in Phase 3 for critical flows                         |
| **Contract Testing (Orval)**        | ⚠️     | ⏰ Later | Add in Phase 2 for auto-generated client                  |
| **Visual Regression Tests**         | ❌     | ❌ Skip  | Too complex for auth tutorial, consider for UI-heavy apps |
| **Performance Tests**               | ❌     | ❌ Skip  | Not needed for tutorial scope                             |
| **Security Tests**                  | ❌     | ⏰ Later | Consider OWASP ZAP or similar in Phase 3                  |

**Legend**:

- ✅ High Priority - Implement soon
- ⏰ Later - Implement when feature complexity requires it
- ❌ Skip - Too complex or covered by simpler tests

---

#### Recommended Next Steps for Testing

**Phase 1.2** (Current - Users Module):

1. ✅ Add unit tests for UserService (similar to AuthService)
2. ✅ Add E2E tests for /users/me endpoints

**Phase 1.3** (Login/Register Frontend):

1. ✅ **COMPLETED** - Setup MSW for frontend testing
2. ✅ **COMPLETED** - Install dependencies: `npm install -D msw @testing-library/user-event`
3. ✅ **COMPLETED** - Create `apps/web/src/test/` directory structure
4. ✅ **COMPLETED** - Write comprehensive tests for login page (11 tests passing)
5. ⏰ Write comprehensive tests for register page (when created)
6. ✅ **COMPLETED** - Test loading states, error states, success states

**Phase 2** (Contract Generation):

1. ⏰ Consider Orval for auto-generating API client
2. ⏰ Generate TypeScript types + React Query hooks from OpenAPI

**Phase 3** (Polish & Production):

1. ⏰ Add Playwright E2E tests for critical flows
2. ⏰ Add security testing (OWASP ZAP)
3. ⏰ Increase test coverage to 80%+ (already met for backend)

---

#### Test Commands Reference

```bash
# Backend Tests
npx nx test api                    # Unit tests (fast, mocked DB)
npx nx run api:e2e                 # E2E tests (slow, real DB required)

# Frontend Tests
npx nx test web                    # Unit + Component tests (with MSW)

# All Tests
npm run test:all                   # All unit tests
npm run e2e:all                    # All E2E tests
npm run health-check               # Full health check (lint + test + e2e)

# Watch Mode
npx nx test api --watch            # Watch mode for TDD
npx nx test web --watch

# Coverage
npx nx test api --coverage         # Generate coverage report
npx nx test web --coverage
```

### Nx Optimization

- **Computation Caching**: Nx caches build and test results
- **Affected Commands**: Only run tasks for changed projects
- **Dependency Graph**: Visualize with `npx nx graph`

## Identified Gaps and Recommendations

### Critical Gaps (Should Implement)

#### 1. Authentication & Authorization

**Current State**: No authentication implementation despite project name "auth-tutorial"

**Recommendations**:

- Implement JWT-based authentication
- Add Passport.js with JWT strategy
- Create auth module with:
  - `/auth/login` endpoint
  - `/auth/register` endpoint
  - `/auth/me` endpoint (protected)
  - JWT guard for protected routes
- Add authentication context to frontend
- Implement refresh token mechanism

**Example Structure**:

```typescript
// apps/api/src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── guards/
│   └── jwt-auth.guard.ts
└── strategies/
    └── jwt.strategy.ts
```

#### 2. Database Integration

**Current State**: No database or ORM configured

**Recommendations**:

- Add Prisma ORM for type-safe database access
- Choose database: PostgreSQL (production) or SQLite (development)
- Create database module with connection management
- Add migration workflow
- Implement repository pattern for data access

**Example Structure**:

```typescript
// apps/api/prisma/
├── schema.prisma
└── migrations/

// apps/api/src/database/
├── database.module.ts
└── prisma.service.ts
```

#### 3. Environment Configuration

**Current State**: No environment variable management

**Recommendations**:

- Add `@nestjs/config` for configuration management
- Create `.env.example` file with all required variables
- Add `.env` to `.gitignore`
- Create configuration schema with validation
- Document environment variables in README

**Required Variables**:

```bash
# API
PORT=3333
NODE_ENV=development
API_PREFIX=api

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/authdb

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

#### 4. Error Handling Strategy

**Current State**: Basic NestJS error handling only

**Recommendations**:

- Create global exception filter
- Define custom exception classes
- Implement standardized error response format
- Add error logging with context
- Add error boundary in React

**Example Error Response**:

```typescript
{
  statusCode: 400,
  message: "Validation failed",
  errors: [
    { field: "email", message: "Invalid email format" }
  ],
  timestamp: "2025-12-05T10:30:00Z",
  path: "/api/auth/register"
}
```

#### 5. Logging & Monitoring

**Current State**: Basic console logging

**Recommendations**:

- Implement structured logging (JSON format)
- Add request correlation IDs
- Log levels: error, warn, info, debug
- Consider Winston or Pino for production
- Add request/response logging middleware
- Implement health check endpoints

**Health Check Endpoints**:

```typescript
GET /health              # Basic health check
GET /health/ready        # Readiness probe (K8s)
GET /health/live         # Liveness probe (K8s)
```

### Important Gaps (Recommended)

#### 6. State Management (Frontend)

**Recommendations**:

- Add lightweight state management (Zustand or React Context)
- Manage authentication state globally
- Implement optimistic updates for better UX

#### 7. API Versioning

**Recommendations**:

- Implement URI versioning: `/api/v1/`
- Plan migration strategy for breaking changes

#### 8. CORS Configuration

**Recommendations**:

- Configure CORS in main.ts
- Allow specific origins from environment variables
- Document CORS policy

#### 9. Security Middleware

**Recommendations**:

- Add Helmet.js for security headers
- Implement rate limiting (e.g., @nestjs/throttler)
- Add request validation globally
- Implement CSRF protection if using cookies

#### 10. Deployment Configuration

**Recommendations**:

- Add Dockerfile for both API and Web
- Create docker-compose.yml for local development
- Add CI/CD configuration (.github/workflows)
- Document deployment process

**CI/CD Pipeline**:

```yaml
# .github/workflows/ci.yml
- Checkout code
- Install dependencies
- Run lint:all
- Run test:all
- Run e2e:all
- Build projects
- Deploy (if main branch)
```

### Nice-to-Have (Future Enhancements)

11. **API Response Caching** - Add Redis for caching
12. **Request Tracing** - OpenTelemetry integration
13. **GraphQL Support** - Consider for complex data requirements
14. **Internationalization (i18n)** - Multi-language support
15. **Feature Flags** - Toggle features without deployments
16. **Database Seeding** - Sample data for development
17. **API Rate Limiting Per User** - Protect against abuse
18. **WebSocket Support** - Real-time features
19. **File Upload Handling** - If needed for user avatars, etc.
20. **Background Jobs** - Bull/BullMQ for async processing

## Security Considerations

### Current Security Measures

- TypeScript for type safety
- ESLint security plugin enabled
- Input validation with class-validator
- Swagger API documentation

### Required Security Enhancements

1. Add authentication and authorization
2. Implement HTTPS in production
3. Add security headers (Helmet.js)
4. Configure CORS properly
5. Implement rate limiting
6. Add CSRF protection
7. Sanitize user inputs
8. Use parameterized queries (when DB is added)
9. Keep dependencies updated
10. Add security scanning to CI/CD

## Performance Considerations

### Current Optimizations

- Nx computation caching
- Next.js automatic code splitting
- Server Components by default (React 19)

### Recommended Optimizations

1. Add Redis for caching frequently accessed data
2. Implement database query optimization
3. Add response compression (gzip/brotli)
4. Optimize bundle size with webpack analysis
5. Implement lazy loading for heavy components
6. Add CDN for static assets in production
7. Use connection pooling for database

## Scalability Path

### Current Scale

- Single API server
- Single Web server
- Development-focused setup

### Future Scaling Options

1. **Horizontal Scaling**

   - Deploy multiple API instances behind load balancer
   - Use stateless authentication (JWT)
   - Add Redis for shared session state if needed

2. **Database Scaling**

   - Read replicas for read-heavy workloads
   - Connection pooling
   - Query optimization

3. **Microservices (if needed)**

   - Split API into domain-specific services
   - Use Nx to manage multiple backend services
   - Implement API gateway

4. **CDN & Caching**
   - CloudFlare or similar for static assets
   - Redis for application caching
   - HTTP caching headers

## Migration Guide

When implementing recommended features:

1. **Start with Foundation** (Priority 1)

   - Environment configuration (#3)
   - Database integration (#2)
   - Error handling (#4)

2. **Add Security** (Priority 2)

   - Authentication & authorization (#1)
   - Security middleware (#9)
   - CORS configuration (#8)

3. **Improve Observability** (Priority 3)

   - Logging & monitoring (#5)
   - Health checks (#5)

4. **Production Readiness** (Priority 4)
   - Deployment configuration (#10)
   - CI/CD pipeline (#10)

## Conclusion

This architecture provides a solid foundation for a modern full-stack application. The current implementation focuses on developer experience, type safety, and maintainability. The identified gaps represent the natural next steps for moving from a starter template to a production-ready application.

The modular nature of the Nx monorepo makes it easy to add new features incrementally without requiring major architectural changes. Each gap can be addressed independently, allowing for prioritization based on specific project requirements.
