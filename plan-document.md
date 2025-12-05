# PLAN.md - Auth Tutorial Implementation Guide

> **Project:** NestJS + Next.js Authentication Tutorial with TanStack Query  
> **Architecture:** Nx Monorepo with Contract-First Development  
> **Timeline:** 2-3 days for complete implementation  
> **Last Updated:** December 5, 2024

---

## Agent Collaboration Guide

### How to Work with AI Agents

#### Prompting Pattern

For each step, use this three-phase approach:

**Phase 1: Context Setting**

```
"I'm implementing Step X.Y: [Step Name]

Current state:
- [List what's already built]
- [List dependencies that are ready]

Goal:
- [What we're building in this step]

Constraints:
- [Technology versions]
- [Architecture principles to follow]
"
```

**Phase 2: Implementation Request**

```
[Copy the specific Agent Prompt from the step above]
```

**Phase 3: Verification Request**

```
"Verify this implementation:
1. Does it follow NestJS/Next.js best practices?
2. Are there type safety issues?
3. What edge cases am I missing?
4. What tests should I write?
5. How does this integrate with existing code?
"
```

#### Example Agent Interaction

```
USER: "I'm implementing Step 0.2: TanStack Query Setup

Current state:
- Nx monorepo is set up
- Next.js 16 with App Router
- Environment variables are configured

Goal:
- Setup TanStack Query with proper SSR support
- Add DevTools for debugging

Constraints:
- Next.js 16 App Router (not Pages Router)
- React 19
- Must work with Server Components
"

AGENT: [Provides implementation]

USER: "Verify this implementation:
1. Is the QueryClient properly configured for SSR?
2. Should staleTime be 60 seconds or different?
3. Do I need any additional configuration for Server Components?
4. How do I test this setup?
"
```

### Git Workflow

#### Commit Convention

Follow Conventional Commits:

```bash
# Features
git commit -m "feat(auth): add JWT authentication"

# Bug fixes
git commit -m "fix(auth): handle token expiration"

# Documentation
git commit -m "docs: update authentication guide"

# Tests
git commit -m "test(auth): add login flow tests"

# Refactoring
git commit -m "refactor(auth): extract token utilities"
```

#### Branch Strategy

```bash
# Create feature branch for each phase
git checkout -b feat/phase-0-infrastructure
git checkout -b feat/phase-1-auth-backend
git checkout -b feat/phase-2-contracts
git checkout -b feat/phase-3-polish

# Merge to main when phase complete
git checkout main
git merge feat/phase-0-infrastructure
```

---

## Success Criteria

### Phase 0 Success Checklist

- [ ] Environment variables load correctly in both apps
- [ ] TanStack Query DevTools visible in browser
- [ ] PostgreSQL running in Docker
- [ ] Prisma migrations applied successfully
- [ ] Can query database with Prisma Studio
- [ ] Mock login works (hardcoded user)
- [ ] Can see "Welcome!" on protected page

### Phase 1 Success Checklist

- [ ] Can register new user with hashed password
- [ ] Can login with valid credentials
- [ ] Invalid credentials return 401
- [ ] JWT token generated on successful login
- [ ] Protected endpoints require valid token
- [ ] GET /auth/me returns current user
- [ ] Frontend stores token correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout clears token and redirects
- [ ] All unit tests pass
- [ ] All E2E tests pass

### Phase 2 Success Checklist

- [ ] Orval generates TypeScript client successfully
- [ ] Generated hooks work in React components
- [ ] TypeScript errors when using wrong types
- [ ] Swagger UI shows comprehensive documentation
- [ ] Can test API endpoints in Swagger UI
- [ ] Frontend uses only generated API client
- [ ] No manual fetch calls in frontend code
- [ ] Contract changes trigger frontend type errors

### Phase 3 Success Checklist

- [ ] Global exception filter catches all errors
- [ ] Errors return standardized format
- [ ] Custom exceptions used throughout
- [ ] Helmet security headers configured
- [ ] Rate limiting active on auth endpoints
- [ ] CORS configured from environment
- [ ] 80%+ test coverage on critical paths
- [ ] Integration tests pass
- [ ] E2E tests pass (Playwright)
- [ ] README is comprehensive
- [ ] API documentation complete
- [ ] Deployment guide written
- [ ] CI/CD pipeline configured

### Production Readiness Checklist

- [ ] All environment variables documented
- [ ] Database migrations documented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error logging implemented
- [ ] Health check endpoints working
- [ ] Dockerfiles created and tested
- [ ] CI/CD pipeline passes
- [ ] Load testing performed
- [ ] Backup strategy documented

---

## Troubleshooting

### Common Issues

#### Issue: TanStack Query not working with Server Components

**Solution:**

- Ensure QueryProvider is marked as 'use client'
- Only layout.tsx should import QueryProvider
- Pages can be Server Components
- Use prefetchQuery on server, hydrate on client

#### Issue: Prisma Client not generating types

**Solution:**

```bash
cd apps/api
npx prisma generate
# Restart TypeScript server in VS Code
```

#### Issue: CORS errors in development

**Solution:**

- Check ALLOWED_ORIGINS in .env
- Ensure Next.js URL is included
- Verify credentials: true in CORS config

#### Issue: JWT token not being sent with requests

**Solution:**

- Check token is stored correctly (localStorage or cookie)
- Verify Authorization header format: "Bearer TOKEN"
- Check token is not expired
- Verify token is included in API client

#### Issue: Orval generation fails

**Solution:**

- Ensure API is running: `npm run start:dev:api`
- Check Swagger JSON is accessible: http://localhost:3333/api-json
- Verify all controllers have proper decorators
- Check orval.config.ts paths are correct

#### Issue: Tests failing after changes

**Solution:**

- Clear Jest cache: `npx jest --clearCache`
- Reset test database
- Check MSW handlers are updated
- Verify fixtures are up to date

### Debugging Tips

**Backend Debugging:**

```bash
# Enable debug logs
DEBUG=* npm run start:dev:api

# Check database state
npx prisma studio

# Test endpoints with curl
curl -v http://localhost:3333/api/auth/login

# Check logs
docker-compose logs -f postgres
```

**Frontend Debugging:**

```bash
# Check React Query state
# Open DevTools → TanStack Query tab

# Check network requests
# Browser DevTools → Network tab

# Check console for errors
# Browser DevTools → Console tab

# Verify environment variables
console.log(process.env.NEXT_PUBLIC_API_URL)
```

### Getting Help

If stuck on a step:

1. **Check the Agent Prompt** - Re-read carefully
2. **Review Verification Steps** - Did they pass?
3. **Search Documentation**:
   - [NestJS Docs](https://docs.nestjs.com)
   - [Next.js Docs](https://nextjs.org/docs)
   - [TanStack Query Docs](https://tanstack.com/query)
   - [Prisma Docs](https://www.prisma.io/docs)
4. **Ask Agent for Clarification**:
   ```
   "I'm stuck on Step X.Y. Here's what I tried: [...]
   Here's the error: [...]
   What should I do differently?"
   ```

---

## Timeline Estimates

### Conservative Timeline (Learning Mode)

- **Phase 0:** 5-6 hours (taking time to understand each piece)
- **Phase 1:** 10-12 hours (building carefully with tests)
- **Phase 2:** 5-6 hours (contract generation and migration)
- **Phase 3:** 8-10 hours (comprehensive testing and polish)
- **Total:** 28-34 hours (4-5 days at 8 hours/day)

### Aggressive Timeline (Speed Mode)

- **Phase 0:** 3-4 hours (quick setup)
- **Phase 1:** 6-8 hours (focus on working code)
- **Phase 2:** 3-4 hours (basic contract generation)
- **Phase 3:** 4-5 hours (essential tests only)
- **Total:** 16-21 hours (2-3 days)

### Recommended Timeline (Balanced)

- **Day 1 Morning:** Phase 0.1-0.2 (Env + TanStack Query)
- **Day 1 Afternoon:** Phase 0.3-0.4 (Database + Mock Auth)
- **Day 2 Morning:** Phase 1.1-1.2 (Auth + Users Backend)
- **Day 2 Afternoon:** Phase 1.3-1.4 (Frontend + Protected Routes)
- **Day 3 Morning:** Phase 2 (Contract Generation)
- **Day 3 Afternoon:** Phase 3.1-3.2 (Error Handling + Security)
- **Day 4:** Phase 3.3-3.4 (Tests + Documentation)

**Total: 4 days of focused work**

---

## Next Steps

### Immediate Action Items

**Right Now:**

```bash
# 1. Review this PLAN.md completely
# 2. Create a branch for Phase 0
git checkout -b feat/phase-0-infrastructure

# 3. Start with Step 0.1
# 4. Use the Agent Prompts provided
# 5. Verify each step before moving forward
```

**First Agent Prompt:**

```
"I'm ready to start implementing the auth tutorial.

I've reviewed PLAN.md and understand the architecture.

Let's begin with Phase 0, Step 0.1: Environment Configuration.

Please implement the environment configuration system for NestJS according to the plan:
[Copy Agent Prompt from Step 0.1]

After implementation, I'll verify with the checklist provided."
```

---

## Additional Resources

### Documentation Links

- [NestJS Authentication Guide](https://docs.nestjs.com/security/authentication)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TanStack Query SSR](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### Example Projects

- [NestJS Sample Projects](https://github.com/nestjs/nest/tree/master/sample)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [TanStack Query Examples](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs)

---

## Conclusion

This plan provides a comprehensive, step-by-step guide to implementing production-ready authentication with NestJS, Next.js, and TanStack Query.

**Key Takeaways:**

1. Follow the phases in order - each builds on the previous
2. Verify each step before moving forward
3. Use the agent prompts as guides, not rigid scripts
4. Test continuously, not just at the end
5. Document as you go
6. Commit frequently with meaningful messages

**Remember:**

- It's okay to take breaks and review
- Understanding > Speed
- Tests are not optional
- Security matters from day 1
- Good documentation is future-you's best friend

**Ready to start?** Begin with Phase 0, Step 0.1! 🚀

---

_Last Updated: December 5, 2024_  
_Version: 1.0_  
_Author: AI-Assisted Development Plan_

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current State](#current-state)
3. [Implementation Phases](#implementation-phases)
4. [Detailed Steps](#detailed-steps)
5. [Agent Collaboration Guide](#agent-collaboration-guide)
6. [Success Criteria](#success-criteria)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### Goals

- ✅ Build production-ready authentication system
- ✅ Learn agent-driven development patterns
- ✅ Implement type-safe contract-first architecture
- ✅ Achieve 80%+ test coverage
- ✅ Master TanStack Query state management

### Architecture Principles

1. **Type Safety First** - Shared types across frontend/backend
2. **Contract-First Development** - API contracts drive implementation
3. **Testability** - Unit, integration, and E2E tests for every feature
4. **Incremental Adoption** - Start simple, add complexity progressively
5. **Developer Experience** - Fast feedback loops with hot reloading

### Tech Stack

```
Backend:  NestJS 11.x + PostgreSQL + Prisma + Passport JWT
Frontend: Next.js 16.x (App Router) + TanStack Query + React 19
Monorepo: Nx 22.x
Testing:  Jest + Playwright + MSW
Contracts: Orval (OpenAPI → TypeScript)
```

---

## Current State

### ✅ What We Have

- [x] Nx monorepo structure (`apps/api`, `apps/web`, `libs/shared-types`)
- [x] NestJS backend with Swagger documentation
- [x] Next.js 16 frontend (App Router)
- [x] TypeScript throughout the stack
- [x] Testing infrastructure (Jest, Playwright)
- [x] Code quality tools (ESLint, Prettier, Husky)
- [x] Health check endpoints

### ❌ What We Need to Build

- [ ] Environment configuration system
- [ ] TanStack Query setup and providers
- [ ] PostgreSQL database + Prisma ORM
- [ ] Authentication module (JWT + bcrypt)
- [ ] User management module
- [ ] Contract generation (Orval)
- [ ] Login/Register pages
- [ ] Protected routes with guards
- [ ] Comprehensive test suite
- [ ] Error handling strategy
- [ ] Security middleware

---

## Implementation Phases

### Phase 0: Critical Infrastructure (Day 1 Morning - 4 hours)

> **Goal:** Set up prerequisites for auth implementation

- **0.1** Environment Configuration (30 min)
- **0.2** TanStack Query Setup (45 min)
- **0.3** Database + Prisma Setup (2 hours)
- **0.4** Quick Auth Proof of Concept (1 hour)

**Milestone:** Can login with hardcoded user and see protected page

---

### Phase 1: Core Authentication (Day 1 Afternoon + Day 2 Morning - 8 hours)

> **Goal:** Production-ready auth with all endpoints

- **1.1** Auth Module Backend (3 hours)
- **1.2** Users Module Backend (2 hours)
- **1.3** Login/Register Frontend (2 hours)
- **1.4** Protected Routes (1 hour)

**Milestone:** Full auth flow works with real database

---

### Phase 2: Contract Generation & Type Safety (Day 2 Afternoon - 4 hours)

> **Goal:** Type-safe API contracts with automatic generation

- **2.1** Orval Configuration (1 hour)
- **2.2** Backend OpenAPI Decorators (1 hour)
- **2.3** Frontend Migration to Generated Client (1.5 hours)
- **2.4** Verification & Testing (30 min)

**Milestone:** Backend changes automatically update frontend types

---

### Phase 3: Polish & Production Readiness (Day 3 - 6 hours)

> **Goal:** Error handling, security, comprehensive tests

- **3.1** Error Handling Strategy (1.5 hours)
- **3.2** Security Hardening (1.5 hours)
- **3.3** Comprehensive Test Suite (2 hours)
- **3.4** Documentation & Deployment Prep (1 hour)

**Milestone:** Production-ready application with 80%+ test coverage

---

## Detailed Steps

## Phase 0: Critical Infrastructure

### Step 0.1: Environment Configuration (30 min)

#### Files to Create

```
apps/api/
  ├── .env.example
  ├── .env                        # gitignored
  └── src/config/
      ├── configuration.ts
      └── validation.ts

apps/web/
  ├── .env.local.example
  └── .env.local                  # gitignored

.gitignore                        # Update
README.md                         # Update with env setup
```

#### Environment Variables

**Backend (.env)**

```bash
# Server
PORT=3333
NODE_ENV=development
API_PREFIX=api

# Database
DATABASE_URL=postgresql://postgres:dev123@localhost:5432/authdb

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1h

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (.env.local)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

#### Dependencies

```bash
npm install @nestjs/config joi
```

#### Agent Prompt

```
Create environment configuration for NestJS:

1. Install @nestjs/config and joi
2. Create apps/api/src/config/configuration.ts that exports:
   - port (default 3333)
   - nodeEnv
   - database.url
   - jwt.secret and jwt.expiresIn
   - cors.allowedOrigins (array)
3. Create apps/api/src/config/validation.ts with Joi schema for validation
4. Create .env.example files with all variables (no values)
5. Update app.module.ts to import ConfigModule.forRoot with validation
6. Add ConfigService injection example in app.service.ts
7. Update .gitignore to exclude .env and .env.local
8. Update README.md with environment setup instructions
```

#### Verification

```bash
# Should load without errors
npm run start:dev:api

# Should see logs confirming config loaded
# Check http://localhost:3333/api health endpoint works
```

---

### Step 0.2: TanStack Query Setup (45 min)

#### Files to Create

```
apps/web/src/
  ├── providers/
  │   └── QueryProvider.tsx
  ├── lib/
  │   └── queryClient.ts
  └── app/
      └── layout.tsx              # Update

package.json                      # Add dependencies
```

#### Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

#### Agent Prompt

```
Setup TanStack Query in Next.js App Router:

1. Install @tanstack/react-query and @tanstack/react-query-devtools
2. Create src/providers/QueryProvider.tsx:
   - Mark as 'use client'
   - Create QueryClient with proper SSR config
   - Use isServer check to prevent client reuse
   - Set default staleTime to 60 seconds
   - Wrap children with QueryClientProvider
3. Create src/lib/queryClient.ts:
   - Export getQueryClient() function
   - Handle server vs browser instances
4. Update app/layout.tsx:
   - Import QueryProvider
   - Wrap {children} with QueryProvider
   - Add ReactQueryDevtools (dev only)
5. Create test component that uses useQuery to verify setup
6. Ensure QueryProvider is a client component but layout stays server component
```

#### Verification

```bash
npm run start:dev:web

# Visit http://localhost:3000
# Should see TanStack Query DevTools button (bottom-right)
# Click to open DevTools panel
```

---

### Step 0.3: Database + Prisma Setup (2 hours)

#### Files to Create

```
apps/api/
  ├── prisma/
  │   ├── schema.prisma
  │   └── migrations/
  └── src/
      ├── database/
      │   ├── database.module.ts
      │   └── prisma.service.ts
      └── app.module.ts           # Update

docker-compose.yml                # PostgreSQL service
```

#### Dependencies

```bash
npm install prisma @prisma/client
npm install -D @types/node
```

#### Agent Prompt - Part 1: Database

```
Setup PostgreSQL with Docker:

1. Create docker-compose.yml in project root:
   - PostgreSQL 16 service
   - Port 5432:5432
   - Environment: POSTGRES_PASSWORD=dev123, POSTGRES_DB=authdb
   - Volume for persistence
   - Container name: auth-postgres
2. Add npm scripts:
   - "db:up": "docker-compose up -d"
   - "db:down": "docker-compose down"
   - "db:logs": "docker-compose logs -f postgres"
3. Update README.md with database setup instructions
```

#### Agent Prompt - Part 2: Prisma

```
Setup Prisma ORM in NestJS:

1. Run: npx prisma init (in apps/api/)
2. Update prisma/schema.prisma:
   - PostgreSQL datasource
   - User model with:
     * id: String @id @default(cuid())
     * email: String @unique
     * password: String (hashed)
     * name: String
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
3. Create PrismaService (extends PrismaClient):
   - Implements OnModuleInit
   - Calls $connect() on init
   - Implements enableShutdownHooks
4. Create DatabaseModule:
   - Provides PrismaService
   - Exports PrismaService
   - Mark as global
5. Import DatabaseModule in AppModule
6. Generate Prisma client: npx prisma generate
7. Create migration: npx prisma migrate dev --name init
8. Add seed script (optional) with test user
```

#### Verification

```bash
# Start database
npm run db:up

# Generate Prisma client
cd apps/api && npx prisma generate

# Run migration
npx prisma migrate dev --name init

# Check database
npx prisma studio  # Opens GUI at http://localhost:5555

# Should see User table (empty)
```

---

### Step 0.4: Quick Auth Proof of Concept (1 hour)

#### Goal

Get a basic login working to validate the stack before building everything.

#### Files to Create

```
apps/api/src/
  └── auth/
      ├── auth.module.ts
      ├── auth.controller.ts      # POST /auth/login only
      └── auth.service.ts         # Mock validation

apps/web/src/
  ├── app/login/
  │   └── page.tsx
  ├── app/home/
  │   └── page.tsx
  └── lib/hooks/
      └── useAuth.ts

libs/shared-types/src/lib/
  └── auth.types.ts
```

#### Agent Prompt

```
Create minimal working auth (no JWT yet):

Backend:
1. Create AuthModule, AuthController, AuthService
2. POST /auth/login endpoint:
   - Accepts { email, password }
   - Returns { user: { id, email, name }, token: "mock-token" }
   - Hardcode one test user: test@example.com / password123
3. No database validation yet (just check email === "test@example.com")

Frontend:
1. Create login page with form (email, password fields)
2. Create useAuth hook:
   - useMutation for login
   - Stores token in localStorage on success
   - Redirects to /home
3. Create /home page (client component):
   - Shows "Welcome!" message
   - Shows logout button that clears token and redirects to /login
4. No auth guard yet (we'll add in Phase 1)

Shared:
1. Create LoginDto and AuthResponse types in shared-types
2. Export from index
```

#### Verification

```bash
# Start both apps
npm run dev:all

# Test flow:
# 1. Visit http://localhost:3000/login
# 2. Enter: test@example.com / password123
# 3. Click login
# 4. Should redirect to /home and see "Welcome!"
# 5. Click logout, return to /login
```

**🎉 Milestone Reached:** Basic auth flow works with TanStack Query!

---

## Phase 1: Core Authentication

### Step 1.1: Auth Module Backend (3 hours)

#### Files to Create

```
apps/api/src/auth/
  ├── auth.module.ts              # Update
  ├── auth.controller.ts          # Update
  ├── auth.service.ts             # Update
  ├── dto/
  │   ├── login.dto.ts
  │   ├── register.dto.ts
  │   └── auth-response.dto.ts
  ├── guards/
  │   └── jwt-auth.guard.ts
  ├── strategies/
  │   └── jwt.strategy.ts
  ├── decorators/
  │   └── current-user.decorator.ts
  └── __tests__/
      ├── auth.service.spec.ts
      ├── auth.controller.spec.ts
      └── auth.e2e-spec.ts
```

#### Dependencies

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### Agent Prompt

```
Implement production-ready authentication:

1. Install passport, JWT, and bcrypt packages
2. Create DTOs:
   - LoginDto: email (string, isEmail), password (string, minLength 6)
   - RegisterDto: extends LoginDto + name (string, minLength 2)
   - AuthResponseDto: user (object), accessToken (string)
3. Update AuthService:
   - register(dto): hash password with bcrypt, create user in DB
   - login(dto): validate credentials, generate JWT token
   - validateUser(email, password): find user, compare passwords
4. Create JWT Strategy:
   - Extract token from Bearer header
   - Validate with JWT_SECRET
   - Return user payload
5. Create JwtAuthGuard extending AuthGuard('jwt')
6. Update AuthController:
   - POST /auth/register (public)
   - POST /auth/login (public)
   - GET /auth/me (protected with JwtAuthGuard)
7. Add Swagger decorators (@ApiTags, @ApiResponse, @ApiBearerAuth)
8. Write tests:
   - Unit: AuthService methods
   - E2E: Register, login, get profile endpoints
9. Handle errors:
   - User already exists (409 Conflict)
   - Invalid credentials (401 Unauthorized)
   - Validation errors (400 Bad Request)
```

#### Verification

```bash
# Run tests
npm run test apps/api/src/auth

# Start API
npm run start:dev:api

# Test with curl or Postman:
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'

# Should return token
# Copy token and test protected endpoint:
curl http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Step 1.2: Users Module Backend (2 hours)

#### Files to Create

```
apps/api/src/users/
  ├── users.module.ts
  ├── users.service.ts
  ├── users.controller.ts
  ├── entities/
  │   └── user.entity.ts
  └── __tests__/
      ├── users.service.spec.ts
      └── users.controller.spec.ts
```

#### Agent Prompt

```
Create Users module:

1. Create UsersService:
   - findByEmail(email): Promise<User | null>
   - findById(id): Promise<User | null>
   - create(data): Promise<User>
   - update(id, data): Promise<User>
   - Inject PrismaService
   - Never return password field
2. Create UsersController:
   - GET /users/me (returns current user, protected)
   - PATCH /users/me (update current user, protected)
3. Create @CurrentUser() decorator:
   - Extracts user from request (set by JWT strategy)
4. Create user.entity.ts (omits password):
   - Export type User = Omit<PrismaUser, 'password'>
5. Write unit tests for UsersService
6. Export UsersService for use in AuthModule
7. Import UsersModule in AuthModule
```

#### Verification

```bash
npm run test apps/api/src/users
```

---

### Step 1.3: Login/Register Frontend (2 hours)

#### Files to Create

```
apps/web/src/
  ├── app/
  │   ├── login/
  │   │   └── page.tsx
  │   ├── register/
  │   │   └── page.tsx
  │   └── home/
  │       └── page.tsx            # Update
  ├── lib/
  │   ├── hooks/
  │   │   ├── useAuth.ts         # Update
  │   │   ├── useRegister.ts
  │   │   └── useUser.ts
  │   ├── auth.ts                # Token utilities
  │   └── api-client.ts          # Fetch wrapper
  └── components/
      └── auth/
          ├── LoginForm.tsx
          └── RegisterForm.tsx

libs/shared-types/src/lib/
  ├── auth.types.ts              # Update
  └── user.types.ts
```

#### Agent Prompt

```
Create login and register pages with TanStack Query:

1. Update shared-types:
   - LoginDto, RegisterDto, AuthResponse, User
   - Export from @auth-tutorial/shared-types
2. Create auth utilities (lib/auth.ts):
   - setToken(token): Store in httpOnly cookie or localStorage
   - getToken(): Retrieve token
   - removeToken(): Clear token
   - isAuthenticated(): Check if token exists
3. Create API client (lib/api-client.ts):
   - fetchApi function that adds Authorization header
   - Base URL from NEXT_PUBLIC_API_URL
   - Throws on non-2xx responses
4. Create useAuth hook:
   - useMutation for login
   - Call POST /auth/login
   - Store token on success
   - Invalidate 'user' query
   - Return { login, isLoading, error }
5. Create useRegister hook:
   - useMutation for register
   - Call POST /auth/register
   - Auto-login on success
6. Create useUser hook:
   - useQuery for current user
   - Call GET /auth/me
   - queryKey: ['user']
   - enabled: only if token exists
   - Return { user, isLoading, error }
7. Create LoginForm component:
   - Email and password fields
   - Submit calls useAuth().login
   - Show error message
   - Link to register page
8. Create RegisterForm component:
   - Email, password, name fields
   - Submit calls useRegister()
9. Create login and register pages using forms
10. Update /home page:
    - Use useUser() to fetch current user
    - Show "Welcome, {user.name}!"
    - Add logout button
11. Add loading states and error handling
```

#### Verification

```bash
npm run start:dev:web

# Test flow:
# 1. Visit /register
# 2. Create account
# 3. Should auto-login and redirect to /home
# 4. See your name
# 5. Logout
# 6. Login again at /login
```

---

### Step 1.4: Protected Routes (1 hour)

#### Files to Create

```
apps/web/src/
  ├── middleware.ts
  ├── app/home/
  │   └── layout.tsx
  └── components/
      ├── ProtectedLayout.tsx
      └── Navigation.tsx
```

#### Agent Prompt

```
Implement route protection:

1. Create middleware.ts:
   - Check for auth token
   - Redirect to /login if no token and trying to access protected routes
   - Redirect to /home if has token and trying to access /login or /register
   - Protected routes: /home, /dashboard, etc.
2. Create ProtectedLayout component:
   - Uses useUser() hook
   - Shows loading spinner while fetching user
   - Redirects to /login if fetch fails (invalid token)
   - Shows navigation with user info
3. Create Navigation component:
   - Shows user name
   - Logout button
   - Links to protected pages
4. Update /home layout.tsx to use ProtectedLayout
5. Handle token expiration gracefully
```

#### Verification

```bash
# Test protected routes:
# 1. Logout
# 2. Try to visit /home directly
# 3. Should redirect to /login
# 4. Login
# 5. Should redirect back to /home
# 6. Try to visit /login while logged in
# 7. Should redirect to /home
```

**🎉 Milestone Reached:** Full auth flow with database and protected routes!

---

## Phase 2: Contract Generation & Type Safety

### Step 2.1: Orval Configuration (1 hour)

#### Files to Create

```
apps/api/
  └── orval.config.ts

tools/scripts/
  └── generate-api-client.sh

apps/web/src/lib/api/
  └── .gitkeep                   # Directory will be generated

.gitignore                       # Update
package.json                     # Add script
```

#### Dependencies

```bash
npm install -D orval
```

#### Agent Prompt

```
Setup Orval for API client generation:

1. Install orval as dev dependency
2. Create orval.config.ts in apps/api/:
   - Input: http://localhost:3333/api-json (Swagger spec)
   - Output: apps/web/src/lib/api/
   - Generate React Query hooks
   - Use axios or fetch
   - Add prettier to output
   - Override mutator with custom fetchApi function
3. Create generate-api-client.sh:
   - Start API server in background
   - Wait for health check
   - Run orval
   - Kill API server
   - Format generated files
4. Add npm script: "generate:api": "sh tools/scripts/generate-api-client.sh"
5. Update .gitignore:
   - apps/web/src/lib/api/
6. Create README section on when to run generation
7. Test generation works
```

#### Verification

```bash
# Generate client
npm run generate:api

# Should create:
# - apps/web/src/lib/api/api.ts
# - apps/web/src/lib/api/model/*.ts

# Check files are properly typed
```

---

### Step 2.2: Backend OpenAPI Decorators (1 hour)

#### Files to Update

```
apps/api/src/
  ├── auth/
  │   ├── auth.controller.ts     # Add decorators
  │   └── dto/*.ts               # Add ApiProperty
  └── users/
      └── users.controller.ts    # Add decorators
```

#### Agent Prompt

```
Add comprehensive OpenAPI decorators:

1. Update all DTOs:
   - Add @ApiProperty to each field
   - Add example values
   - Add description
2. Update AuthController:
   - @ApiTags('Authentication')
   - @ApiOperation for each endpoint
   - @ApiResponse with status codes and types
   - @ApiBearerAuth for protected endpoints
3. Update UsersController:
   - @ApiTags('Users')
   - Complete operation and response decorators
4. Ensure main.ts Swagger setup is complete:
   - Title, description, version
   - Bearer auth configured
5. Test Swagger UI at /api/docs
6. Regenerate client and verify types improved
```

#### Verification

```bash
# Visit http://localhost:3333/api/docs
# Should see comprehensive documentation
# Try out endpoints in Swagger UI

# Regenerate client
npm run generate:api

# Check generated types are more detailed
```

---

### Step 2.3: Frontend Migration to Generated Client (1.5 hours)

#### Files to Update

```
apps/web/src/lib/
  ├── hooks/
  │   ├── useAuth.ts             # Use generated hooks
  │   ├── useRegister.ts         # Use generated hooks
  │   └── useUser.ts             # Use generated hooks
  └── api-client.ts              # Remove manual endpoints
```

#### Agent Prompt

```
Migrate frontend to use generated API client:

1. Update useAuth hook:
   - Import generated useLoginMutation or useAuthLogin
   - Remove manual fetch call
   - Keep token storage logic
2. Update useRegister hook:
   - Import generated useRegisterMutation
   - Remove manual fetch call
3. Update useUser hook:
   - Import generated useGetMe query hook
   - Remove manual fetch call
4. Remove custom API client functions that are now generated
5. Verify types are enforced:
   - Try using wrong property name → should fail TypeScript
   - Try missing required field → should fail TypeScript
6. Update imports across all components
7. Test entire auth flow still works
```

#### Verification

```bash
# Run TypeScript check
npm run type-check

# Run all apps
npm run dev:all

# Test complete auth flow
# Should work exactly as before but with generated types
```

---

### Step 2.4: Verification & Testing (30 min)

#### Tasks

```
1. Break the contract intentionally:
   - Remove a field from DTO
   - Run generate:api
   - Build should fail with TypeScript error
   - Fix and regenerate

2. Add new endpoint:
   - Add GET /auth/refresh on backend
   - Add decorators
   - Regenerate client
   - Use new hook on frontend
   - Verify works

3. Document workflow in README
```

**🎉 Milestone Reached:** Type-safe contracts with automatic generation!

---

## Phase 3: Polish & Production Readiness

### Step 3.1: Error Handling Strategy (1.5 hours)

#### Files to Create

```
apps/api/src/common/
  ├── filters/
  │   └── http-exception.filter.ts
  ├── exceptions/
  │   ├── auth.exception.ts
  │   └── validation.exception.ts
  └── interceptors/
      └── transform.interceptor.ts

apps/web/src/
  ├── app/error.tsx
  └── lib/
      └── error-handler.ts
```

#### Agent Prompt

```
Implement comprehensive error handling:

Backend:
1. Create global exception filter:
   - Catches all exceptions
   - Returns standardized format:
     { statusCode, message, errors[], timestamp, path }
   - Logs errors with context
2. Create custom exceptions:
   - InvalidCredentialsException (401)
   - UserAlreadyExistsException (409)
   - InvalidTokenException (401)
3. Create transform interceptor:
   - Wraps successful responses
   - Format: { data, statusCode, timestamp }
4. Register globally in main.ts
5. Update controllers to use custom exceptions

Frontend:
1. Create error.tsx boundary:
   - Catches React errors
   - Shows friendly message
   - Offers reset button
2. Create error handler utility:
   - Extracts error message from API response
   - Handles different error formats
3. Update mutation hooks to use error handler
4. Show toast notifications for errors
```

---

### Step 3.2: Security Hardening (1.5 hours)

#### Dependencies

```bash
npm install helmet @nestjs/throttler
```

#### Files to Create

```
apps/api/src/
  ├── main.ts                    # Update
  └── common/
      ├── guards/
      │   └── throttler.guard.ts
      └── middleware/
          └── security.middleware.ts
```

#### Agent Prompt

```
Harden security:

1. Install helmet and throttler
2. Configure Helmet in main.ts:
   - Security headers
   - CSP policy
   - HSTS
3. Setup rate limiting:
   - @nestjs/throttler
   - 10 requests per minute for auth endpoints
   - 100 requests per minute for others
4. Configure CORS:
   - Use ALLOWED_ORIGINS from env
   - Credentials: true
   - Proper headers
5. Add request sanitization
6. Implement CSRF protection (if using cookies)
7. Add security headers middleware
8. Document security measures in README
```

---

### Step 3.3: Comprehensive Test Suite (2 hours)

#### Files to Create

```
libs/testing/
  ├── fixtures/
  │   ├── user.fixtures.ts
  │   └── auth.fixtures.ts
  ├── mocks/
  │   └── handlers.ts            # MSW handlers
  └── setup/
      ├── test-db.ts
      └── jest.setup.ts

apps/web/__tests__/
  ├── integration/
  │   └── auth-flow.test.tsx
  └── e2e/
      └── auth.spec.ts           # Playwright

apps/api/test/
  └── auth.e2e-spec.ts           # Complete E2E
```

#### Agent Prompt

```
Create comprehensive test suite:

1. Create test fixtures:
   - User factory with Faker
   - Auth response factory
   - Reusable test data
2. Setup MSW for frontend tests:
   - Mock handlers for all auth endpoints
   - Success and error scenarios
3. Write integration tests (Frontend):
   - Login flow with mocked API
   - Registration flow
   - Protected route access
   - Logout flow
4. Write E2E tests (Playwright):
   - Complete user journey
   - Register → Login → View profile → Logout
   - Test with real backend
5. Write E2E tests (Backend):
   - Test all auth endpoints
   - Test error cases
   - Test token expiration
6. Setup test database:
   - Separate from dev database
   - Reset between tests
7. Add coverage reporting
8. Document testing strategy
```

#### Verification

```bash
# Run all tests
npm run test:all

# Run E2E tests
npm run e2e:all

# Check coverage
npm run test:coverage

# Target: 80%+ coverage on critical paths
```

---

### Step 3.4: Documentation & Deployment Prep (1 hour)

#### Files to Create/Update

```
README.md                        # Comprehensive update
ARCHITECTURE.md                  # Update with auth
docs/
  ├── API.md                     # API documentation
  ├── DEPLOYMENT.md              # Deployment guide
  └── TESTING.md                 # Testing guide

Dockerfile                       # API container
apps/web/Dockerfile              # Web container
docker-compose.prod.yml          # Production compose
.github/workflows/
  └── ci.yml                     # CI/CD pipeline
```

#### Agent Prompt

```
Complete documentation and deployment:

1. Update README.md:
   - Clear setup instructions
   - Environment variables
   - Common tasks
   - Troubleshooting section
2. Create API.md:
   - All endpoints documented
   - Request/response examples
   - Authentication flow
3. Create DEPLOYMENT.md:
   - Production checklist
   - Environment setup
   - Database migrations
   - SSL/HTTPS configuration
4. Create Dockerfiles:
   - Multi-stage builds
   - Optimized images
   - Health checks
5. Create CI/CD pipeline:
   - Lint, test, build
   - Run on PR and main
   - Deploy to staging
6. Add deployment scripts
```

**🎉 Final Milestone:** Production-ready auth system with complete documentation!

---
