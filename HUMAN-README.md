# auth-tutorial

An Nx monorepo featuring a NestJS backend API and Next.js frontend web application with comprehensive testing setup.

---

## 📊 Current Sprint

**Sprint Goal**: Phase 3: Polish & Production Readiness

**Active Task**: 3.4: Documentation & Deployment Prep
**Current Phase**: Phase 3: Polish & Production
**Status**: ⏳ IN PROGRESS

### Quick Stats

- **Tests**: 126/127 passing (99% pass rate) - Full Health Check PASSED (2025-12-07)
- **Build**: ✅ All projects building
- **Linting**: ✅ All passing
- **Last Session**: Session 11 - Phase 3.1 Error Handling Complete (2025-12-07)

### Current Sprint Objectives

- [x] 3.1: Error Handling Strategy ✅ COMPLETE
  - Global exception filter with standardized error responses
  - React Error Boundary component with fallback UI
  - User-friendly ErrorMessage component
  - Correlation IDs for request tracking
  - Documented in ADR-016

- [x] 3.2: Security Hardening ✅ COMPLETE
  - HTTP security headers (Helmet.js) with CSP, HSTS, XSS protection
  - Rate limiting with @nestjs/throttler (100 requests per 15 minutes)
  - Environment-driven CORS configuration
  - Documented in ADR-017 and CONFIG.md

- [x] 3.3: Comprehensive Test Suite ✅ COMPLETE
  - Security E2E tests for all Phase 3.2 features
  - Fixed ThrottlerGuard dependency injection bug
  - All security features have comprehensive test coverage

- [ ] 3.4: Documentation & Deployment Prep (Deployment guide, environment documentation)

### Recent Accomplishments

**Phase 3.3: Comprehensive Test Suite (Completed 2025-12-07)**

- ✅ Created comprehensive security E2E test suite (11 tests covering all security features).
- ✅ Fixed critical ThrottlerGuard dependency injection bug preventing API from working.
- ✅ Added tests for security headers: CSP, HSTS, X-Frame-Options, X-XSS-Protection, nosniff.
- ✅ Added tests for rate limiting configuration and @SkipThrottle() decorator functionality.
- ✅ Added tests for CORS configuration with credentials support.
- ✅ Added tests for standardized error responses with correlation ID validation.
- ✅ Fixed Jest E2E configuration to transform uuid ESM package (transformIgnorePatterns).
- ✅ Documented intentionally skipped test (clearAllEvents no-op after API migration).
- ✅ All security features from Phase 3.2 now have comprehensive test coverage (35 E2E tests passing).

**Phase 3.2: Security Hardening (Completed 2025-12-07)**

- ✅ Implemented Helmet.js for HTTP security headers (CSP, HSTS, XSS protection, clickjacking protection).
- ✅ Added rate limiting with @nestjs/throttler (100 requests per 15 minutes per IP).
- ✅ Configured environment-driven CORS for flexible deployment scenarios.
- ✅ Exempted health check endpoint from rate limiting with @SkipThrottle().
- ✅ Documented security configuration in CONFIG.md with production checklist.
- ✅ Created ADR-017 documenting the security hardening strategy.
- ✅ All tests verified passing with security measures implemented.

**Phase 3.1: Error Handling Strategy (Completed 2025-12-07)**

- ✅ Implemented global HTTP exception filter with standardized error responses.
- ✅ Created React Error Boundary to catch and handle component errors gracefully.
- ✅ Built user-friendly error UI components (ErrorBoundary, ErrorFallback, ErrorMessage).
- ✅ Added correlation IDs for request tracking and debugging.
- ✅ Structured error logging with dev/prod modes.
- ✅ 126/127 tests passing, full health check verified.
- ✅ ADR-016 documented comprehensive error handling strategy.

### Blockers

- **None** - All systems operational

### Next Up

1. **Phase 3.4**: Documentation & Deployment Prep
2. **Phase 4**: Feature Expansion (Event Editing/Filtering)
3. **Tech Debt**: Resolve 1 remaining skipped unit test

---

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation & Development

```bash
npm install
npm run dev:all
```

This starts both the API (http://localhost:3333/api) and Web app (http://localhost:3000).

### Available Commands

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev:all`      | Start both API and Web servers               |
| `npm run test:all`     | Run all unit tests                           |
| `npm run e2e:all`      | Run all E2E tests                            |
| `npm run lint:all`     | Lint all projects                            |
| `npm run health-check` | Full system verification (lint + test + e2e) |

### Server URLs

- **API**: http://localhost:3333/api
- **API Docs**: http://localhost:3333/api/docs (Swagger UI)
- **Web App**: http://localhost:3000

---

## Project Structure

```
auth-tutorial/
├── apps/
│   ├── api/              # NestJS backend API
│   ├── api-e2e/          # API E2E tests (Jest)
│   ├── web/              # Next.js frontend
│   └── web-e2e/          # Web E2E tests (Playwright)
├── libs/
│   └── shared-types/     # Shared TypeScript types
└── .add/                 # Agent co-dev documentation
```

---

## Documentation

- **Comprehensive Docs**: See [.add/README.md](.add/README.md) for detailed project information and agent guidance
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Session History**: See [.add/SESSION.md](.add/SESSION.md)
- **Memory & Patterns**: See [.add/MEMORY.md](.add/MEMORY.md)

---

## Troubleshooting

### Full System Verification

```bash
npm run health-check
```

Expected outcome: Exit code 0 indicates all tests and linting passed.

### Common Issues

- **Missing reflect-metadata**: Ensure it's imported at the top of `apps/api/src/main.ts`
- **Port conflicts**: Run `npm run kill-ports` to free ports 3000 and 3333

---

## Learn More

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright Documentation](https://playwright.dev)
