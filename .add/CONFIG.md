# ADD Framework Configuration

## Framework Settings

### Health Check Mode

**Current Mode**: `strict`

**Available Modes**:

- `strict`: All checks must pass before session end (RECOMMENDED)
- `warn`: Log failures but allow continuation
- `off`: Skip automated checks

### Health Check Rules

When in `strict` mode, the following must pass before ending a session:

1. **Linting**: All projects must pass ESLint checks
2. **Unit Tests**: All unit tests must pass (skipped tests documented)
3. **E2E Tests**: All E2E tests must pass (optional: can be skipped with justification)
4. **Build**: All projects must build successfully (optional: can be deferred)
5. **Type Check**: All TypeScript must compile without errors

### Git Hooks

**Pre-Commit Hooks**: None configured yet

**Pre-Push Hooks**: None configured yet

### Session Protocol

#### Session Start Checklist

1. Read README.md "Current Sprint" section
2. Read .add/SESSION.md for latest state
3. Read .add/MEMORY.md for project context
4. Read .add/TASKS.md for current objectives
5. Check .add/BLOCKERS.md for obstacles
6. Update SESSION.md with new session start entry

#### Session End Checklist

1. Mark completed tasks in TASKS.md
2. Update MEMORY.md with session learnings
3. Run health checks per CONFIG.md (tests, linting, build)
4. Document any architecture decisions in DECISIONS.md
5. Update BLOCKERS.md status
6. Write session summary in SESSION.md
7. Update README.md "Current Sprint" with latest status
8. Commit changes with descriptive message

### Documentation Rules

- All .add/ files are markdown and git-tracked
- README stays lightweight - executive summary only
- ARCHITECTURE.md is the source of truth for design
- Never delete session history in SESSION.md
- MEMORY.md accumulates knowledge, never shrinks
- Update README "Current Sprint" every session end
- DECISIONS.md entries are immutable once made

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:

```
feat(web): implement event planner feature

- Created Event data model with types
- Built useEvents hook with localStorage
- Created EventForm and EventList components
- Added comprehensive tests (96/98 passing)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Project-Specific Settings

### Monorepo Structure

- **Type**: Nx monorepo
- **Package Manager**: npm
- **Node Version**: 18+

### Test Commands

```bash
npm run test:all      # All unit tests
npm run e2e:all       # All E2E tests
npm run lint:all      # All linting
npm run health-check  # Complete health check
```

### Development Commands

```bash
npm run dev:clean     # Clean start (kills ports, removes locks)
npm run dev:all       # Start both API and Web
npm run kill-ports    # Kill processes on 3000 and 3333
npm run clean-locks   # Remove Next.js lock files
```

### Database Commands

```bash
npm run db:up         # Start PostgreSQL
npm run db:down       # Stop PostgreSQL
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```

## Security Configuration

### CORS (Cross-Origin Resource Sharing)

**Environment Variable**: `ALLOWED_ORIGINS`

**Default Value**: `http://localhost:3000` (development)

**Usage in Code**:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  credentials: true,
});
```

**Environment-Specific Values**:

```bash
# .env (development)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# .env.production
ALLOWED_ORIGINS=https://example.com,https://app.example.com

# .env.test
ALLOWED_ORIGINS=http://localhost:3000
```

**Multiple Origins Format**: Comma-separated list without spaces

### HTTP Security Headers (Helmet.js)

Headers automatically added to all API responses:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Restricts resource origins | XSS Prevention |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | HTTPS Enforcement |
| X-Content-Type-Options | nosniff | MIME Sniffing Prevention |
| X-Frame-Options | DENY | Clickjacking Prevention |
| X-XSS-Protection | 1; mode=block | Browser XSS Protection |

**Configuration**: apps/api/src/main.ts (lines 44-74)

### Rate Limiting

**Module**: @nestjs/throttler

**Default Limits**:
- 100 requests per 15 minutes (900000ms)
- Per IP address
- Applied globally to all endpoints

**Exceptions**:
- Health check endpoint (GET /api) - uses @SkipThrottle() decorator

**Rate Limit Response**:
- Status: 429 Too Many Requests
- Includes retry-after header with seconds to wait

**Configuration**: apps/api/src/app/app.module.ts

**Fine-tuning Rate Limits**:

```typescript
// In app.module.ts, adjust ThrottlerModule configuration:
ThrottlerModule.forRoot([
  {
    name: 'default',
    ttl: 900000,     // Time window in milliseconds
    limit: 100,      // Number of requests allowed
  },
]),
```

**Exempting Endpoints**:

```typescript
// In any controller method:
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Get()
getData() {
  // This endpoint is not rate-limited
}
```

### Production Security Checklist

Before deploying to production:

- [ ] Update `ALLOWED_ORIGINS` with production domain(s)
- [ ] Verify HSTS header with `preload: true`
- [ ] Test CSP directives against all resource types used
- [ ] Adjust rate limits based on expected traffic
- [ ] Enable HTTPS/TLS (required for security headers)
- [ ] Review and adjust CSP directives for your specific resources
- [ ] Test rate limiting with production traffic patterns
- [ ] Monitor security headers with tools like securityheaders.com

### Monitoring Security Headers

**Using curl**:

```bash
curl -I https://api.example.com/api
```

Look for these headers in the response:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

**Using Browser DevTools**:

1. Open DevTools (F12)
2. Go to Network tab
3. Make a request to the API
4. Check Response Headers for security headers
