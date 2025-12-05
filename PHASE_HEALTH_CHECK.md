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
```

**Expected**: No linting errors

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

- [ ] `npx nx test api` passes
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] JWT token generated correctly
- [ ] Protected endpoints require auth
- [ ] Swagger docs updated

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

Last Updated: 2025-12-05
