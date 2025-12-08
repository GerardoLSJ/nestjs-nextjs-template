# Project Context

> **Always Loaded** | ~1000 tokens | Last Updated: 2025-12-07

## Stack

- **Monorepo**: Nx workspace
- **Backend**: NestJS 10+ (TypeScript strict mode)
- **Frontend**: Next.js 14+ (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + Refresh tokens with Passport.js
- **Testing**: Jest (unit) + Supertest (API E2E) + Playwright (Web E2E) + MSW (mocking)
- **Security**: Helmet.js headers + Rate limiting (@nestjs/throttler)
- **Contract**: OpenAPI/Swagger + Orval (generated client)

## Structure

```
nestjs-nextjs-template/
├── apps/
│   ├── api/          → NestJS backend (port 3333)
│   ├── api-e2e/      → API E2E tests (Jest + Supertest)
│   ├── web/          → Next.js frontend (port 3000)
│   └── web-e2e/      → Web E2E tests (Playwright)
├── libs/
│   └── shared-types/ → Shared TypeScript types
└── .add/             → ADD Framework memory system
```

## Conventions

### Code Style

- **TypeScript**: Strict mode, no `any`
- **React**: Functional components with hooks
- **Exports**: Barrel exports from `index.ts`
- **API**: DTOs for all contracts, OpenAPI decorators
- **Formatting**: ESLint + Prettier (enforced)

### Naming

- **Files**: `kebab-case.ts` (e.g., `user-service.ts`)
- **Classes**: `PascalCase` (e.g., `UserService`)
- **Functions/variables**: `camelCase` (e.g., `getUserById`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- **Components**: `PascalCase.tsx` (e.g., `EventForm.tsx`)
- **CSS Modules**: `ComponentName.module.css`

### Git

- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`)
- **Branches**: `feature/<name>`, `fix/<issue>`, `refactor/<scope>`
- **Example**: `feat(auth): implement JWT refresh token rotation`

## Key Patterns

### Backend (NestJS)

**Service Pattern**:

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }
}
```

**Controller Pattern**:

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserDto })
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
```

### Frontend (Next.js)

**Server Component** (default):

```typescript
export default async function Page({ params }: Props) {
  const data = await fetchData(params.id);
  return <Component data={data} />;
}
```

**Client Component** (interactive):

```typescript
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

**Custom Hook Pattern**:

```typescript
export function useCustomHook() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data
  }, []);

  return { data, isLoading };
}
```

## Quick Commands

### Development

```bash
npm run dev:clean       # Clean start (kills ports, removes locks)
npm run dev:all         # Start API + Web concurrently
npm run kill-ports      # Kill processes on 3000 and 3333
```

### Database

```bash
npm run db:up           # Start PostgreSQL (Docker)
npm run db:down         # Stop PostgreSQL
npm run db:migrate      # Run Prisma migrations
npm run db:studio       # Open Prisma Studio GUI
npm run db:generate     # Generate Prisma client
```

### Testing

```bash
npm run test:all        # All unit tests
npm run e2e:all         # All E2E tests
npm run lint:all        # ESLint all projects
npm run health-check    # Full verification (lint + test + e2e)
```

### Contract Generation

```bash
npm run api:generate    # Generate OpenAPI client with Orval
```

### Individual Projects

```bash
npx nx serve api        # Start API only
npx nx dev web          # Start Web only
npx nx test <project>   # Run tests for specific project
npx nx e2e <project>    # Run E2E for specific project
```

## Current Project State

### Phase 3: Polish & Production ✅ COMPLETE

**Completed**:

- ✅ 3.1: Error Handling Strategy (Global filters, error boundaries, correlation IDs)
- ✅ 3.2: Security Hardening (Helmet.js, rate limiting, CORS)
- ✅ 3.3: Comprehensive Test Suite (Security E2E tests)
- ✅ 3.4: Documentation & Deployment Prep

### Deployment Infrastructure (Provisioned)

| Resource           | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Resource Group     | `rg-authapp-dev-westus3`                                           |
| Container Registry | `authappdevwus3acr.azurecr.io`                                     |
| API App            | `authapp-dev-api.lemonrock-c989340f.westus3.azurecontainerapps.io` |
| Web App            | `authapp-dev-web.lemonrock-c989340f.westus3.azurecontainerapps.io` |
| Database           | `authapp-dev-postgres.postgres.database.azure.com`                 |

**Next**:

- Phase 4: Feature Expansion (Event editing, filtering)

### Test Status

- **Total**: 126/127 tests passing (99% pass rate)
- **Web Unit**: 103 tests
- **API Unit**: 22 tests
- **Shared Types**: 1 test
- **API E2E**: 35 tests (including 11 security tests)
- **Health Check**: ✅ PASSING

### Key Features

1. **Authentication**: JWT with Passport.js, bcrypt password hashing
2. **Event Planner**: Full CRUD with PostgreSQL persistence, calendar picker
3. **Contract-First API**: OpenAPI/Swagger with Orval generated client
4. **Security**: Helmet headers, rate limiting, CORS configuration
5. **Error Handling**: Global filters, error boundaries, correlation IDs
6. **Testing**: Comprehensive unit + E2E + MSW mocking

---

_Update this file when stack, conventions, or project state changes_
