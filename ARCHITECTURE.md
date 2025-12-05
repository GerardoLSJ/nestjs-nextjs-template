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
- **Styling**: (To be determined based on requirements)

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

#### Testing

- **Unit Tests**: Jest 30.x
- **Integration Tests**: Jest with supertest (API)
- **E2E Tests**: Playwright (Web), Jest (API)

### Project Structure

```
auth-tutorial/
├── apps/
│   ├── api/                    # NestJS REST API
│   │   ├── src/
│   │   │   ├── app/           # Application modules
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── *.controller.ts
│   │   │   │   ├── *.service.ts
│   │   │   │   └── *.module.ts
│   │   │   └── main.ts        # Application entry point
│   │   ├── project.json       # Nx project configuration
│   │   └── webpack.config.js  # Webpack configuration for build
│   ├── api-e2e/               # API E2E tests
│   ├── web/                   # Next.js frontend
│   │   ├── src/app/           # Next.js App Router
│   │   │   ├── api/           # API routes (if needed)
│   │   │   ├── page.tsx       # Pages
│   │   │   └── layout.tsx     # Layouts
│   │   └── project.json
│   └── web-e2e/               # Web E2E tests (Playwright)
├── libs/
│   └── shared-types/          # Shared TypeScript definitions
│       └── src/lib/
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

3. **API Integration**
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
- Conventional commit message format

### Testing Strategy

1. **Unit Tests** (Fast, isolated)

   - Test individual functions and classes
   - Mock external dependencies
   - Coverage: Business logic, utilities, services

2. **Integration Tests** (Moderate speed)

   - Test module interactions
   - Test database operations (when added)
   - Test API endpoints with real HTTP calls

3. **E2E Tests** (Slow, comprehensive)
   - Test complete user flows
   - Test API contracts
   - Test critical user journeys

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
