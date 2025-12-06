# Health Check Protocol

> Quality gates and validation rules for ensuring system health

## Health Check Mode

**Current Mode**: `strict`

See [CONFIG.md](CONFIG.md) for mode configuration.

---

## Automated Health Checks

### Full Health Check

**Command**: `npm run health-check`

**What it runs**:

1. Linting (all projects)
2. Unit tests (all projects)
3. E2E tests (all projects)

**Expected Outcome**: Exit code 0 (all checks pass)

**When to run**:

- Before ending a session (if in strict mode)
- Before committing major changes
- After completing a phase
- Before creating a pull request

**Current Status**: ✅ PASSING (as of Session 5)

---

## Individual Health Checks

### 1. Linting

**Command**: `npm run lint:all`

**What it checks**:

- ESLint rules compliance
- Import ordering
- TypeScript best practices
- Code style consistency

**Success Criteria**:

- Exit code 0
- No errors
- Warnings acceptable if pre-existing

**Current Status**:

- ✅ API: Passing
- ✅ Web: Passing (5 pre-existing warnings)
- ✅ Shared Types: Passing

**Individual Commands**:

```bash
npx nx lint api          # Lint API only
npx nx lint web          # Lint Web only
npx nx lint shared-types # Lint shared types
```

---

### 2. Unit Tests

**Command**: `npm run test:all`

**What it checks**:

- All unit tests across all projects
- Test coverage (optional)
- No skipped tests (unless documented)

**Success Criteria**:

- Exit code 0
- All tests passing
- Skipped tests documented in BLOCKERS.md

**Current Status**:

- ✅ API: 10/10 passing (~2s)
- ✅ Web: 96/98 passing, 2 skipped (~8.2s)
  - 2 skipped: useEvents localStorage isolation (documented in BLOCKERS.md)
- ✅ Shared Types: 1/1 passing

**Individual Commands**:

```bash
npx nx test api          # Test API only
npx nx test web          # Test Web only
npx nx test shared-types # Test shared types
```

---

### 3. E2E Tests

**Command**: `npm run e2e:all`

**What it checks**:

- Integration of API and Web
- Real HTTP requests
- Database interactions
- End-to-end workflows

**Success Criteria**:

- Exit code 0
- All E2E tests passing
- Database must be running

**Current Status**:

- ✅ API E2E: 6/6 passing (~5s)
  - Register, login, protected routes
- ⏳ Web E2E: Not implemented yet
  - Playwright setup exists but no tests written

**Individual Commands**:

```bash
npx nx e2e api-e2e       # API E2E tests
npx nx e2e web-e2e       # Web E2E tests (Playwright)
```

**Prerequisites**:

- PostgreSQL running (`npm run db:up`)
- Environment variables configured

---

### 4. Build Check

**Command**: `npx nx run-many --target=build --all`

**What it checks**:

- TypeScript compilation
- Webpack bundling (API)
- Next.js build (Web)
- No build errors

**Success Criteria**:

- Exit code 0
- All projects build successfully
- No TypeScript errors

**Current Status**: ✅ PASSING (periodic checks)

**Individual Commands**:

```bash
npx nx build api         # Build API only
npx nx build web         # Build Web only
```

**Note**: Build check is optional and can be deferred for faster iteration

---

## Phase Health Checks

### Phase Completion Criteria

Before marking a phase as complete:

- [ ] All phase tasks completed
- [ ] All tests passing (or skips documented)
- [ ] Linting passing
- [ ] Documentation updated (ARCHITECTURE.md, SESSION.md)
- [ ] Decisions documented (DECISIONS.md)
- [ ] No unresolved blockers
- [ ] Code committed with conventional commit message

### Phase-Specific Checks

#### Phase 0: Critical Infrastructure ✅

- [x] Environment configuration working
- [x] TanStack Query setup verified
- [x] Database connection successful
- [x] Mock auth proof of concept working
- [x] All tests passing

**Completed**: Session 1 (2025-12-05)

---

#### Phase 1: Core Authentication ✅

**Phase 1.1: Auth Module Backend** ✅

- [x] JWT authentication working
- [x] Register endpoint functional
- [x] Login endpoint functional
- [x] Password hashing with bcrypt
- [x] Unit tests passing (10/10)
- [x] E2E tests passing (6/6)

**Phase 1.2: Frontend Testing Infrastructure** ✅

- [x] MSW setup complete
- [x] Login page tests passing (11/11)
- [x] Test polyfills working
- [x] No Jest environment errors

**Phase 1.3: Mobile App Layout** ✅

- [x] MobileLayout component working
- [x] Header and BottomNavigation functional
- [x] Auth-aware layout rendering
- [x] All 7 authentication scenarios verified
- [x] Layout component tests passing (26/26)

**Phase 1.4: Protected Routes & Polish** ✅

- [x] useAuth hook implemented
- [x] ProtectedRoute component working
- [x] All pages refactored
- [x] Hook and component tests passing (15/15)
- [x] All web tests passing (52/52)

**Completed**: Sessions 1-4 (2025-12-05 to 2025-12-06)

---

#### Phase 2: Contract Generation ⏳

**Prerequisites**:

- [ ] Phase 1 complete ✅
- [ ] Orval installed
- [ ] OpenAPI spec generated

**Checks**:

- [ ] Orval configuration working
- [ ] TypeScript client generated
- [ ] No type errors after generation
- [ ] Generated client used in frontend
- [ ] All API calls migrated
- [ ] Tests updated for generated client
- [ ] Contract changes trigger TypeScript errors

**Status**: PENDING

---

#### Phase 3: Polish & Production ⏳

**Prerequisites**:

- [ ] Phase 2 complete
- [ ] 80%+ test coverage

**Checks**:

- [ ] Error handling comprehensive
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Test coverage ≥80%
- [ ] E2E tests for critical paths
- [ ] Documentation complete
- [ ] Deployment guide written

**Status**: PENDING

---

## Test Execution Benchmarks

### Current Performance

| Test Suite   | Tests   | Time   | Status    |
| ------------ | ------- | ------ | --------- |
| API Unit     | 10      | ~2s    | ✅ Pass   |
| Web Unit     | 96/98   | ~8.2s  | ✅ Pass\* |
| Shared Types | 1       | <1s    | ✅ Pass   |
| API E2E      | 6       | ~5s    | ✅ Pass   |
| **Total**    | 113/115 | ~15.2s | ✅ Pass\* |

\* 2 tests skipped in useEvents.spec.ts (documented in BLOCKERS.md)

### Performance Targets

- **Unit Tests**: <10s total
- **E2E Tests**: <30s total
- **Full Health Check**: <1 minute
- **Build**: <2 minutes

**Current Total**: ~15.2s (well within targets)

---

## Continuous Monitoring

### What to Monitor

1. **Test Pass Rate**: Should stay ≥95%
2. **Build Time**: Should not increase significantly
3. **Lint Warnings**: Should not increase
4. **Dependencies**: Keep up to date (npm audit)

### Red Flags

- Tests that start failing intermittently
- Build times increasing significantly
- New lint errors introduced
- Security vulnerabilities in dependencies

### Response Protocol

If health checks fail:

1. Investigate root cause immediately
2. Document in BLOCKERS.md
3. Create mitigation plan
4. Fix before continuing
5. Update health check if needed

---

## Health Check History

### Session 5 - 2025-12-06

**Status**: ✅ PASSING

**Results**:

- Linting: ✅ All projects passing
- Unit Tests: ✅ 96/98 web tests, 10/10 api tests
- E2E Tests: ✅ 6/6 api-e2e tests
- Build: ✅ All projects building

**Notes**:

- 2 useEvents tests skipped (localStorage isolation)
- 5 pre-existing lint warnings in web project
- All critical functionality tested

---

### Session 4 - 2025-12-06

**Status**: ✅ PASSING

**Results**:

- Linting: ✅ All projects passing
- Unit Tests: ✅ 52/52 web tests, 10/10 api tests
- E2E Tests: ✅ 6/6 api-e2e tests
- Build: ✅ All projects building

**Notes**:

- Phase 1.4 complete
- All web tests passing
- useAuth and ProtectedRoute tested

---

### Session 3 - 2025-12-06

**Status**: ✅ PASSING

**Results**:

- Linting: ✅ All projects passing (pre-existing warnings)
- Unit Tests: ✅ 37/37 web tests, 10/10 api tests
- E2E Tests: ✅ 6/6 api-e2e tests
- Build: ✅ All projects building

**Notes**:

- Mobile layout fully tested
- 26 new layout component tests
- All authentication scenarios verified

---

### Session 2 - 2025-12-06

**Status**: ✅ PASSING

**Results**:

- Linting: ✅ All projects passing
- Unit Tests: ✅ 22/22 tests (11 web, 10 api, 1 shared)
- E2E Tests: ✅ 6/6 api-e2e tests
- Build: ✅ All projects building

**Notes**:

- MSW infrastructure working
- Login page fully tested
- No polyfill issues

---

### Session 1 - 2025-12-05

**Status**: ✅ PASSING

**Results**:

- Linting: ✅ All projects passing
- Unit Tests: ✅ 10/10 api tests
- E2E Tests: ✅ 6/6 api-e2e tests
- Build: ✅ API building successfully

**Notes**:

- Phase 0 and 1.1 complete
- Backend authentication fully tested
- E2E infrastructure working

---

## Manual Health Checks

### Smoke Tests (Optional)

Before ending a session, manually verify:

1. **Development Servers Start**: `npm run dev:all`
   - API at http://localhost:3333/api
   - Web at http://localhost:3000
2. **Registration Works**: Create test account
3. **Login Works**: Login with test account
4. **Protected Routes Work**: Access protected pages
5. **Event Planner Works**: Create, view, delete events
6. **Logout Works**: Logout and verify redirect

**Time**: ~5 minutes

---

## Notes

- Health checks are enforced in strict mode (see CONFIG.md)
- All check failures must be documented in BLOCKERS.md
- Skipped tests must be justified and documented
- Health check history helps track project quality over time
- When in doubt, run the full health check
