# Gotcha Registry

## Index

| ID   | Zone     | Severity | Summary                                     |
| ---- | -------- | -------- | ------------------------------------------- |
| G001 | api      | critical | Use bcryptjs, not native bcrypt             |
| G002 | web      | high     | NEXT_PUBLIC vars need build-time setting    |
| G003 | database | medium   | Run prisma generate after schema changes    |
| G004 | api      | high     | JWT secret must be in environment           |
| G005 | web      | medium   | Regenerate API client after OpenAPI changes |

---

## G001: Use bcryptjs for Password Hashing

**Zone**: api
**Severity**: critical
**Files**: `apps/api/src/auth/auth.service.ts`
**Trigger**: When modifying password hashing or authentication

### Description

Native bcrypt requires native compilation which fails in Docker multi-stage builds. The project uses bcryptjs (pure JS implementation) instead.

### Safe Pattern

```typescript
import * as bcrypt from 'bcryptjs';
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

### Wrong Pattern

```typescript
import * as bcrypt from 'bcrypt'; // Will fail in Docker
```

### Detection

Check import statements in auth-related files.

---

## G002: NEXT_PUBLIC Environment Variables

**Zone**: web
**Severity**: high
**Files**: `apps/web/Dockerfile`, `apps/web/.env*`
**Trigger**: When working with environment variables in frontend

### Description

Next.js bakes NEXT*PUBLIC*\* variables at build time. For Docker, these must be passed as build args, not runtime env vars.

### Safe Pattern

```dockerfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
```

### Wrong Pattern

```dockerfile
RUN npm run build
# Setting NEXT_PUBLIC_API_URL at runtime won't work
```

### Detection

Verify Dockerfile passes NEXT_PUBLIC vars as ARG before build step.

---

## G003: Prisma Generate After Schema Changes

**Zone**: database
**Severity**: medium
**Files**: `prisma/schema.prisma`
**Trigger**: After modifying database schema

### Description

Prisma client is generated code. Changes to schema.prisma require regeneration.

### Safe Pattern

```bash
npx prisma migrate dev --name your_migration
# or
npx prisma generate
```

### Wrong Pattern

Editing schema.prisma and expecting types to update automatically.

### Detection

If TypeScript errors appear after schema changes, run `npx prisma generate`.

---

## G004: JWT Secret Configuration

**Zone**: api
**Severity**: high
**Files**: `apps/api/src/auth/auth.module.ts`
**Trigger**: When configuring authentication

### Description

JWT secret must never be hardcoded. Always use ConfigService to read from environment.

### Safe Pattern

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
  }),
  inject: [ConfigService],
});
```

### Wrong Pattern

```typescript
JwtModule.register({
  secret: 'hardcoded-secret', // Security vulnerability
});
```

### Detection

Search for hardcoded strings in JWT configuration.

---

## G005: Regenerate API Client After OpenAPI Changes

**Zone**: web
**Severity**: medium
**Files**: `apps/web/src/lib/api/`, `apps/api/src/main.ts`
**Trigger**: After modifying API endpoints or DTOs

### Description

Frontend uses Orval-generated API client based on OpenAPI spec. Changes to backend endpoints require regeneration.

### Safe Pattern

```bash
npm run api:generate
```

### Wrong Pattern

Manually updating API client code or expecting auto-sync.

### Detection

TypeScript errors in API calls after backend changes indicate stale client.
