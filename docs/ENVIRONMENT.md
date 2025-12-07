# Environment Variables Documentation

## Overview

This document describes all environment variables used in the auth-tutorial application. Environment-specific configurations are managed through `.env` files.

---

## File Structure

```
nestjs-nextjs-template/
├── .env                      # Development (local)
├── .env.test                 # Testing
├── .env.production          # Production (DO NOT COMMIT)
├── apps/api/
│   ├── .env.example         # Example API env vars
│   └── .env.test            # Test environment
└── apps/web/
    └── .env.local.example   # Example Web env vars
```

---

## Development Environment (.env)

Used for local development with `npm run dev:all`.

### Database Configuration

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_app_dev"

# Or individual components:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_app_dev
```

### API Configuration

```bash
# Node environment
NODE_ENV=development

# API port
PORT=3333

# JWT Configuration
JWT_SECRET=dev-secret-key-minimum-32-characters-long
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=dev-refresh-secret-key-minimum-32-characters
JWT_REFRESH_EXPIRATION=604800

# Security: CORS allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug
```

### Web Configuration

```bash
# Next.js environment
NEXT_PUBLIC_API_URL=http://localhost:3333/api

# Optional: Analytics (disable in development)
NEXT_PUBLIC_ANALYTICS=false
```

### Example .env File

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_app_dev"

# API
NODE_ENV=development
PORT=3333
JWT_SECRET=your-dev-secret-key-minimum-32-characters-long
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=your-dev-refresh-secret-key-minimum-32-characters
JWT_REFRESH_EXPIRATION=604800
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=debug

# Web
NEXT_PUBLIC_API_URL=http://localhost:3333/api
NEXT_PUBLIC_ANALYTICS=false
```

---

## Testing Environment (.env.test)

Used for automated tests with `npm run test:all` and `npm run e2e:all`.

### Configuration

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_app_test"

# API
NODE_ENV=test
PORT=3333
JWT_SECRET=test-secret-key-minimum-32-characters-long
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=test-refresh-secret-key-minimum-32-characters
JWT_REFRESH_EXPIRATION=604800
ALLOWED_ORIGINS=http://localhost:3000

# Logging: Suppress debug logs during tests
LOG_LEVEL=error

# Testing specifics
TEST_DATABASE_DROP=true
```

### Notes

- Uses separate test database (auto-created/dropped by test suite)
- Shorter expiration times for faster test execution
- Logging level set to error to reduce noise

---

## Production Environment (.env.production)

Used for production deployments. **Never commit to version control!**

### Secure Storage

Store production secrets in:

- **Docker**: Use Docker secrets or environment variables passed at runtime
- **Cloud Platform**: Use managed secrets (AWS Secrets Manager, Azure Key Vault, etc.)
- **Kubernetes**: Use ConfigMaps and Secrets
- **CI/CD**: Use GitHub Actions secrets, GitLab CI/CD variables, etc.

### Configuration

```bash
# Database
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/auth_app"

# API
NODE_ENV=production
PORT=3333
JWT_SECRET=<long-random-production-secret-minimum-32-characters>
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=<long-random-production-refresh-secret>
JWT_REFRESH_EXPIRATION=604800
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com

# Logging
LOG_LEVEL=info

# Security
TLS_ENABLED=true
CORS_CREDENTIALS=true

# Performance
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Checklist Before Deployment

- [ ] `JWT_SECRET` is long and random (min 32 characters)
- [ ] `JWT_REFRESH_SECRET` is different from `JWT_SECRET`
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] `ALLOWED_ORIGINS` includes only production domains
- [ ] `NODE_ENV=production`
- [ ] `LOG_LEVEL` set appropriately (not debug)
- [ ] `.env.production` is in `.gitignore`
- [ ] All secrets are stored securely (not in code)

---

## Environment-Specific Variables

### All Environments

| Variable       | Required | Default | Description                                      |
| -------------- | -------- | ------- | ------------------------------------------------ |
| `NODE_ENV`     | Yes      | -       | Environment: `development`, `test`, `production` |
| `DATABASE_URL` | Yes      | -       | PostgreSQL connection string                     |
| `PORT`         | No       | 3333    | API port                                         |
| `LOG_LEVEL`    | No       | info    | Logging level: `debug`, `info`, `warn`, `error`  |

### API Only

| Variable                 | Required | Default               | Description                                      |
| ------------------------ | -------- | --------------------- | ------------------------------------------------ |
| `JWT_SECRET`             | Yes      | -                     | Secret for signing JWT tokens (min 32 chars)     |
| `JWT_EXPIRATION`         | No       | 3600                  | JWT expiration time in seconds (1 hour)          |
| `JWT_REFRESH_SECRET`     | Yes      | -                     | Secret for signing refresh tokens (min 32 chars) |
| `JWT_REFRESH_EXPIRATION` | No       | 604800                | Refresh token expiration in seconds (7 days)     |
| `ALLOWED_ORIGINS`        | No       | http://localhost:3000 | Comma-separated CORS allowed origins             |

### Web (Next.js) Only

| Variable                | Required | Default | Description                            |
| ----------------------- | -------- | ------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | Yes      | -       | API base URL (public, sent to browser) |
| `NEXT_PUBLIC_ANALYTICS` | No       | false   | Enable analytics tracking              |

---

## Generating Secure Secrets

### Generate JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Example Output

```
jwt_secret: b3f8d4c9e2a1f7b6c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5

jwt_refresh_secret: a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
```

---

## Database Connection Strings

### PostgreSQL Connection String Format

```
postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
```

### Examples

**Local Development**:

```
postgresql://postgres:postgres@localhost:5432/auth_app_dev
```

**Docker Compose**:

```
postgresql://postgres:postgres@postgres:5432/auth_app_dev
```

**AWS RDS**:

```
postgresql://user:password@rds-instance.c9akciq32.us-east-1.rds.amazonaws.com:5432/auth_app
```

**Connection Pool (PgBouncer)**:

```
postgresql://user:password@pgbouncer:6432/auth_app
```

---

## Loading Environment Variables

### Node.js / NestJS

```typescript
// apps/api/src/config/configuration.ts
import { config } from '@nestjs/config';

export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '3600s',
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
});
```

### Next.js

```typescript
// apps/web/next.config.js
module.exports = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

// Usage in components
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Docker / Docker Compose

```yaml
# docker-compose.yml
services:
  api:
    image: api:latest
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
```

---

## Common Issues & Troubleshooting

### Issue: "Invalid JWT Secret"

**Cause**: Secret is too short or not set

**Solution**:

```bash
# Generate new secret (min 32 characters)
openssl rand -base64 32

# Update .env
JWT_SECRET=<generated-secret>
```

### Issue: "Database Connection Failed"

**Cause**: Incorrect connection string or PostgreSQL not running

**Solution**:

```bash
# Start PostgreSQL
npm run db:up

# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Issue: "CORS Error"

**Cause**: Frontend origin not in `ALLOWED_ORIGINS`

**Solution**:

```bash
# Add frontend origin to ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# For production:
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com
```

### Issue: "JWT Token Expired"

**Cause**: `JWT_EXPIRATION` too short

**Solution**:

```bash
# Increase expiration (in seconds)
JWT_EXPIRATION=86400  # 24 hours
JWT_EXPIRATION=604800 # 7 days
```

---

## Environment Validation

### Validation Schema (NestJS)

```typescript
// apps/api/src/config/validation.ts
import { plainToClass } from 'class-transformer';
import { IsString, IsOptional, validate } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  NODE_ENV: string = 'development';

  @IsString()
  @IsOptional()
  ALLOWED_ORIGINS: string = 'http://localhost:3000';
}

export function validateEnv(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig);

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables: ${errors}`);
  }

  return validatedConfig;
}
```

---

## Secrets Management Best Practices

### Do's

- ✅ Use strong, random secrets (min 32 characters)
- ✅ Store secrets in secure vaults (AWS Secrets Manager, etc.)
- ✅ Rotate secrets regularly (quarterly or after incidents)
- ✅ Use different secrets per environment
- ✅ Log secret access for audit trails
- ✅ Use environment variables for runtime configuration

### Don'ts

- ❌ Don't commit `.env.production` to git
- ❌ Don't use weak or predictable secrets
- ❌ Don't share secrets via email or chat
- ❌ Don't hardcode secrets in source code
- ❌ Don't use same secret across environments
- ❌ Don't log or print secrets

---

## Docker Secrets Integration

### Using Docker Secrets

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    image: api:latest
    environment:
      JWT_SECRET_FILE: /run/secrets/jwt_secret
      DATABASE_URL_FILE: /run/secrets/db_url
    secrets:
      - jwt_secret
      - db_url

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  db_url:
    file: ./secrets/db_url.txt
```

### Reading Docker Secrets in Node.js

```typescript
import fs from 'fs';

const jwtSecret = fs.readFileSync('/run/secrets/jwt_secret', 'utf8').trim();
const databaseUrl = fs.readFileSync('/run/secrets/db_url', 'utf8').trim();
```

---

## Kubernetes Secrets

```yaml
# kubernetes/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  jwt-secret: <base64-encoded-secret>
  db-url: <base64-encoded-url>

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
        - name: api
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: jwt-secret
```

---

## References

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Prisma Environment Variables](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated**: 2025-12-07  
**Version**: 1.0  
**Maintainer**: Project Team
