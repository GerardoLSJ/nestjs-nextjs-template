# Security Context

<!-- @confidence: 0.85 -->
<!-- @verified: 2024-12-09 -->
<!-- @source: code-audit -->

> **Tokens**: ~800 | **Triggers**: security, helmet, cors, rate-limit, throttle, headers, csp, hsts

## Overview

Multi-layered security with Helmet.js HTTP headers, rate limiting, and environment-driven CORS configuration.

## Key Files

- `apps/api/src/main.ts` - Helmet and CORS configuration
- `apps/api/src/app/app.module.ts` - ThrottlerModule setup
- `apps/api/src/app/app.controller.ts` - @SkipThrottle() example
- `apps/api/src/security/security.e2e-spec.ts` - Security E2E tests
- `.env` - Environment configuration (ALLOWED_ORIGINS)

## Patterns

### Helmet.js Security Headers

**Configuration** (`main.ts`):

```typescript
import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    hidePoweredBy: true,
    xssFilter: true,
    frameguard: { action: 'deny' },
  })
);
```

**Headers Added**:

| Header                    | Value                               | Purpose                  |
| ------------------------- | ----------------------------------- | ------------------------ |
| Content-Security-Policy   | Restricts resource origins          | XSS Prevention           |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | HTTPS Enforcement        |
| X-Content-Type-Options    | nosniff                             | MIME Sniffing Prevention |
| X-Frame-Options           | DENY                                | Clickjacking Prevention  |
| X-XSS-Protection          | 1; mode=block                       | Browser XSS Protection   |

### Rate Limiting

**Configuration** (`app.module.ts`):

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 900000, // 15 minutes
        limit: 100, // 100 requests
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

**Exempting Endpoints**:

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  @Get()
  @SkipThrottle() // Health check endpoint not rate limited
  getData() {
    return { message: 'OK' };
  }
}
```

### CORS Configuration

**Environment-Driven** (`main.ts`):

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
});
```

**Environment Variables**:

```env
# .env (development)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# .env.production
ALLOWED_ORIGINS=https://example.com,https://app.example.com

# .env.test
ALLOWED_ORIGINS=http://localhost:3000
```

## Common Operations

### Verifying Security Headers

**Using curl**:

```bash
curl -I http://localhost:3333/api
```

Look for:

- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

**Using Browser DevTools**:

1. Open DevTools (F12)
2. Go to Network tab
3. Make request to API
4. Check Response Headers

### Testing Rate Limiting

**E2E Test**:

```typescript
it('should apply rate limiting', async () => {
  // First request succeeds
  await request(app.getHttpServer())
    .get('/api/events')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // After 100 requests within 15 minutes, should get 429
  // (In practice, test just verifies rate limiting is configured)
});
```

### Adjusting Rate Limits

```typescript
ThrottlerModule.forRoot([
  {
    name: 'default',
    ttl: 60000, // 1 minute
    limit: 10, // 10 requests
  },
]);
```

## Gotchas

### ThrottlerGuard Dependency Injection

**Problem**: Manual instantiation doesn't inject configuration

**Incorrect**:

```typescript
app.useGlobalGuards(new ThrottlerGuard());
```

**Correct**:

```typescript
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

### CORS Multiple Origins

**Format**: Comma-separated string (no spaces)

```env
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

**Parsing**:

```typescript
origin: process.env.ALLOWED_ORIGINS?.split(',');
```

### CSP Strictness

**Problem**: Too strict CSP breaks legitimate resources

**Solution**: Adjust directives based on actual needs

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],  // Allow external images
    scriptSrc: ["'self'", "'unsafe-eval'"],  // If needed for dev tools
  },
},
```

## Production Security Checklist

Before deploying:

- [ ] Update `ALLOWED_ORIGINS` with production domain(s)
- [ ] Verify HSTS header with `preload: true`
- [ ] Test CSP directives against all resources
- [ ] Adjust rate limits based on expected traffic
- [ ] Enable HTTPS/TLS (required for security headers)
- [ ] Test rate limiting with production patterns
- [ ] Monitor headers with securityheaders.com

## Quick Commands

```bash
# Verify security headers
curl -I http://localhost:3333/api

# Run security E2E tests
npx nx run api:e2e --testPathPattern=security

# Check all tests with security measures
npm run health-check
```

## Test Coverage

**Security E2E Tests** (11 tests):

- 6 tests for Helmet headers
- 3 tests for rate limiting
- 1 test for CORS
- 1 test for error handling with correlation IDs

## Architecture Decisions

**ADR-017**: Security Hardening Strategy
**ADR-018**: Comprehensive Security Test Suite

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [Auth Module](auth.md) - JWT authentication
- [API Module](api.md) - Protected endpoints
- [Error Handling Module](error-handling.md) - Standardized error responses
- [Testing Module](testing.md) - Security E2E tests
