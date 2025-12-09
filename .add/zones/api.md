# Zone: API Backend

<!-- @zone-id: api -->
<!-- @confidence: 0.85 -->
<!-- @languages: typescript -->
<!-- @test-coverage: full -->

## Boundaries

- Path: `apps/api/**/*`

## Testing Capabilities

- Unit tests: Yes
- Integration tests: Yes
- E2E tests: Yes (Playwright)

## Key Modules

- `src/auth/` - JWT authentication with Passport.js
- `src/users/` - User management
- `src/events/` - Event planner CRUD
- `src/prisma/` - Database service
- `src/common/` - Shared utilities, filters, interceptors

## Known Gotchas

1. bcryptjs is used instead of native bcrypt for Docker compatibility
2. JWT secret must be in environment variables, never hardcoded
3. Global exception filter requires correlation ID middleware to be registered first

## Pattern Exceptions

- `prisma/` directory at root contains schema, not in apps/api
