# Phase Health Check Protocol

## Purpose

At the end of each implementation phase, run this health check to ensure:

1. All tests pass
2. Code builds successfully
3. Runtime functionality works
4. No regressions introduced

## Health Check Commands

### 1. Unit Tests

```bash
# Run all API tests
npx nx test api

# Run all Web tests
npx nx test web

# Run tests for all projects
npx nx run-many --target=test --all
```

**Expected**: All tests pass (green)

### 1b. E2E Tests

```bash
# IMPORTANT: Start database first!
docker-compose up -d

# Run API e2e tests
npx nx run api:e2e

# Run all e2e tests
npx nx run-many --target=e2e --all
```

**Expected**: All e2e tests pass (requires database to be running)

**Important Notes:**

- E2E tests require PostgreSQL to be running (`docker-compose up -d`)
- Tests use supertest to make real HTTP requests against the NestJS app
- Each test run creates unique users with timestamps to avoid conflicts
- E2E tests are automatically excluded from unit test runs
- E2E test file pattern: `*.e2e-spec.ts`

### 2. Build Verification

```bash
# Build API
npx nx build api

# Build Web
npx nx build web

# Build all projects
npx nx run-many --target=build --all
```

**Expected**: No compilation errors

### 3. Linting

```bash
# Lint all projects
npx nx run-many --target=lint --all

# Auto-fix what can be fixed
npx nx run-many --target=lint --all --fix
```

**Expected**: No linting errors in source code

**Known Issues (Can be ignored):**

- Generated Prisma files (`apps/api/src/generated/prisma/**`) will have linting errors
- These are auto-generated files and should NOT be manually edited
- Consider adding `.eslintignore` to exclude generated files if needed
- Focus on linting errors in your own source code (`apps/api/src/auth/**`, etc.)

### 4. Type Checking

```bash
# Type check entire workspace
npx tsc --noEmit
```

**Expected**: No TypeScript errors

### 5. Runtime Verification

```bash
# Start both apps
npm run dev:all

# Verify API health endpoint
curl http://localhost:3333/api

# Verify Web loads
curl http://localhost:3000
```

**Expected**: Both apps start and respond correctly

---

## Phase-Specific Health Checks

### Phase 0: Critical Infrastructure

**After 0.1: Environment Configuration**

- [ ] `npx nx test api` passes
- [ ] API starts with config loaded
- [ ] ConfigService returns correct values
- [ ] No .env files in git

**After 0.2: TanStack Query Setup**

- [ ] `npx nx test web` passes
- [ ] Web app starts with QueryProvider
- [ ] DevTools visible in browser
- [ ] No console errors

**After 0.3: Database + Prisma Setup**

- [ ] `npx nx test api` passes
- [ ] Docker PostgreSQL running
- [ ] Prisma migrations applied
- [ ] Prisma Studio accessible
- [ ] PrismaService injectable

**After 0.4: Mock Auth Proof of Concept**

- [ ] `npx nx test api` passes
- [ ] `npx nx test web` passes
- [ ] Can login with test credentials
- [ ] Token stored correctly
- [ ] Redirect to /home works

### Phase 1: Core Authentication

**After 1.1: Auth Module Backend**

- [ ] `npx nx test api` passes (unit tests)
- [ ] `npx nx run api:e2e` passes (e2e tests)
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] JWT token generated correctly
- [ ] Protected endpoints require auth
- [ ] Swagger docs updated
- [ ] E2E tests cover all auth endpoints

**After 1.2: Users Module Backend**

- [ ] `npx nx test api` passes
- [ ] GET /users/me works
- [ ] PATCH /users/me works
- [ ] @CurrentUser decorator works
- [ ] Password never returned in responses

**After 1.3: Login/Register Frontend**

- [ ] `npx nx test web` passes
- [ ] Registration flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Error messages display correctly
- [ ] Loading states work

**After 1.4: Protected Routes**

- [ ] `npx nx test web` passes
- [ ] Unauthenticated users redirect to /login
- [ ] Authenticated users access protected routes
- [ ] Token expiration handled gracefully
- [ ] Middleware functions correctly

### Phase 2: Contract Generation

**After 2.1: Orval Configuration**

- [ ] `npm run generate:api` succeeds
- [ ] Generated files in correct location
- [ ] TypeScript types generated correctly
- [ ] No compilation errors with generated code

**After 2.2: Backend OpenAPI Decorators**

- [ ] `npx nx test api` passes
- [ ] Swagger UI shows all endpoints
- [ ] Request/response schemas documented
- [ ] Can test endpoints in Swagger UI
- [ ] Generated client improves after decorators

**After 2.3: Frontend Migration**

- [ ] `npx nx test web` passes
- [ ] All API calls use generated client
- [ ] No manual fetch calls remain
- [ ] Type safety enforced
- [ ] Auth flow still works

**After 2.4: Verification**

- [ ] Breaking contract change caught by TypeScript
- [ ] New endpoint automatically generates hooks
- [ ] Full end-to-end flow works
- [ ] Documentation accurate

### Phase 3: Polish & Production

**After 3.1: Error Handling**

- [ ] `npx nx test api` passes
- [ ] `npx nx test web` passes
- [ ] Global exception filter catches errors
- [ ] Standardized error format
- [ ] Frontend shows user-friendly errors

**After 3.2: Security Hardening**

- [ ] `npx nx test api` passes
- [ ] Rate limiting works
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Helmet configured

**After 3.3: Comprehensive Tests**

- [ ] Unit test coverage ≥80%
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] All test suites pass
- [ ] Coverage reports generated

**After 3.4: Documentation**

- [ ] README complete
- [ ] API.md complete
- [ ] DEPLOYMENT.md complete
- [ ] All code documented
- [ ] CI/CD pipeline passes

---

## Quick Health Check (Use This After Each Phase)

```bash
# Run this single command after each phase
npx nx run-many --target=test --all && \
npx nx run-many --target=lint --all && \
npx nx run-many --target=build --all

# If all pass, the phase is healthy ✅
```

---

## When Health Check Fails

1. **Read the error carefully** - Understand what broke
2. **Identify the cause** - Which changes introduced the issue?
3. **Fix the root cause** - Don't just fix the symptom
4. **Update tests** - Ensure tests reflect new behavior
5. **Re-run health check** - Verify fix works
6. **Document the fix** - Update SESSION_TRACKER with decision

---

## Before Committing Changes

Always run the quick health check before committing:

```bash
# Full health check
npm run health-check

# This runs: lint:all && test:all && e2e:all
```

**Never commit if health check fails.**

---

## Troubleshooting Common Issues

### E2E Tests Failing

**Problem**: `npx nx run api:e2e` fails with connection errors

**Solution**:

```bash
# 1. Ensure database is running
docker-compose up -d
docker-compose ps  # Verify postgres is up

# 2. Check database is accessible
docker-compose logs postgres

# 3. Verify Prisma migrations are applied
cd apps/api && npx prisma migrate dev
```

### Linting Errors in Generated Files

**Problem**: Thousands of linting errors in `apps/api/src/generated/prisma/**`

**Solution**: This is expected and can be safely ignored. These are auto-generated Prisma client files. To exclude them:

Create `apps/api/.eslintignore`:

```
src/generated/**
```

### Import Errors in Tests

**Problem**: `_supertest is not a function` or similar import errors

**Solution**:

```typescript
// Use default import, not namespace import
import request from 'supertest'; // ✅ Correct
// NOT: import * as request from 'supertest';  // ❌ Wrong
```

### Database Connection Errors

**Problem**: Tests fail with "Can't reach database server"

**Solution**:

```bash
# 1. Start database
docker-compose up -d

# 2. Wait for database to be ready
sleep 5

# 3. Run migrations
cd apps/api && npx prisma migrate dev

# 4. Then run tests
npx nx run api:e2e
```

### Port Already in Use (EADDRINUSE)

**Problem**: `npm run dev:all` fails with "address already in use :::3333" or ":::3000"

**Solution**:

```bash
# Recommended: Use the automated cleanup script
npm run kill-ports

# Or manually find and kill processes on Windows
netstat -ano | findstr :3333
netstat -ano | findstr :3000
powershell "taskkill /pid <PID> /F"

# Or manually find and kill processes on macOS/Linux
lsof -ti:3333 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Next.js Lock File Error

**Problem**: "Unable to acquire lock at apps/web/.next/dev/lock, is another instance of next dev running?"

**Solution**:

```bash
# Recommended: Use the automated cleanup script
npm run clean-locks

# Or manually remove lock file on Windows PowerShell
powershell "Remove-Item 'apps/web/.next/dev/lock' -Force"

# Or manually remove lock file on macOS/Linux
rm -f apps/web/.next/dev/lock
```

### Both Issues at Once (Recommended)

**Problem**: Combination of port conflicts and lock file errors

**Solution**:

```bash
# Clean everything and start fresh (recommended)
npm run dev:clean

# This automatically:
# 1. Kills processes on ports 3000 and 3333
# 2. Removes Next.js lock files
# 3. Starts both API and Web apps
```

**Prevention**: Always properly stop `npm run dev:all` with Ctrl+C before restarting. If processes don't terminate cleanly, use `npm run dev:clean` instead of `npm run dev:all`.

---

Last Updated: 2025-12-05
