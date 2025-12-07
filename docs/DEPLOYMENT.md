# Deployment Guide

## Overview

This guide covers deploying the auth-tutorial application to production. The application consists of:

- **Backend API**: NestJS application (Node.js)
- **Frontend Web**: Next.js application (Node.js)
- **Database**: PostgreSQL
- **Monorepo**: Managed by Nx

---

## Pre-Deployment Checklist

Before deploying to production, ensure all items are completed:

### Code Quality

- [ ] All tests passing: `npm run health-check`
- [ ] Linting clean: `npm run lint:all`
- [ ] No TypeScript errors
- [ ] Code reviewed and approved

### Security

- [ ] Environment variables configured correctly
- [ ] HTTPS/TLS enabled
- [ ] CORS origins configured for production domains
- [ ] Rate limiting adjusted for expected traffic
- [ ] Security headers verified (see [CONFIG.md](CONFIG.md))
- [ ] No hardcoded secrets in code

### Database

- [ ] PostgreSQL setup in production environment
- [ ] Database migrations tested
- [ ] Backups configured
- [ ] Connection pooling configured

### Documentation

- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployment guide completed
- [ ] Runbook created for team

---

## Deployment Strategies

### Option 1: Docker (Recommended)

#### Prerequisites

- Docker and Docker Compose installed
- Docker registry access (for pushing images)

#### Build Docker Images

```bash
# Build API image
docker build -t your-registry/api:latest -f apps/api/Dockerfile .

# Build Web image
docker build -t your-registry/web:latest -f apps/web/Dockerfile .

# Push to registry
docker push your-registry/api:latest
docker push your-registry/web:latest
```

#### Deploy with Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: auth_app
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  api:
    image: your-registry/api:latest
    environment:
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/auth_app
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      NODE_ENV: production
    ports:
      - '3333:3333'
    depends_on:
      - postgres
    restart: always

  web:
    image: your-registry/web:latest
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
    ports:
      - '3000:3000'
    depends_on:
      - api
    restart: always

volumes:
  postgres_data:
```

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Option 2: Cloud Platform Deployment (Node.js)

#### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create your-app-api --buildpack heroku/nodejs
heroku create your-app-web --buildpack heroku/nodejs

# Configure environment variables
heroku config:set -a your-app-api \
  DATABASE_URL=postgres://... \
  JWT_SECRET=your-secret \
  ALLOWED_ORIGINS=https://your-domain.com

heroku config:set -a your-app-web \
  NEXT_PUBLIC_API_URL=https://your-app-api.herokuapp.com

# Deploy
git push heroku main:main
```

#### AWS ECS Deployment

1. Create ECS cluster
2. Create task definitions for API and Web
3. Create services for API and Web
4. Configure Application Load Balancer (ALB)
5. Setup auto-scaling policies
6. Configure RDS for PostgreSQL

**See AWS documentation for detailed steps.**

#### Vercel (Next.js Web Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy web app
cd apps/web
vercel --prod

# Configure environment variables in Vercel dashboard
```

---

## Environment Variables for Production

Create `.env.production` file with:

```bash
# API Environment
NODE_ENV=production
PORT=3333

# Database
DATABASE_URL=postgres://user:password@host:5432/db_name

# Authentication
JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters
JWT_EXPIRATION=3600

# Security
ALLOWED_ORIGINS=https://example.com,https://app.example.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.example.com

# Logging
LOG_LEVEL=info
```

**Never commit `.env.production` to version control!**

---

## Database Setup

### Initial Migration

```bash
# Run migrations in production environment
NODE_ENV=production npx prisma migrate deploy

# View Prisma Studio (if needed for debugging)
NODE_ENV=production npx prisma studio
```

### Backup Strategy

**PostgreSQL Automated Backups**:

```bash
# Manual backup
pg_dump postgres://user:password@host/dbname > backup.sql

# Restore from backup
psql postgres://user:password@host/dbname < backup.sql
```

---

## Health Checks

### API Health Check

```bash
# Should return 200 OK
curl https://api.example.com/api

# Response:
# {"message":"Hello API"}
```

### Web Health Check

```bash
# Should return 200 OK
curl https://example.com/

# Response: HTML page
```

### Database Connection

```bash
# SSH into production server
ssh user@example.com

# Connect to database
psql postgres://user:password@localhost/auth_app

# Run query
SELECT 1;
```

---

## Monitoring & Logging

### Application Monitoring

1. **Error Tracking**:
   - Set up Sentry for error monitoring
   - Configure in `.env.production`

2. **Performance Monitoring**:
   - Enable APM (Application Performance Monitoring)
   - Track response times, database queries
   - Monitor resource usage

3. **Uptime Monitoring**:
   - Use monitoring service (UptimeRobot, Datadog)
   - Alert on failures

### Logging

```bash
# View API logs
docker logs <api-container-id>

# View Web logs
docker logs <web-container-id>

# View database logs
docker logs <postgres-container-id>
```

---

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Auto-Renewal with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d api.example.com

# Auto-renewal (runs via cron daily)
sudo certbot renew --quiet
```

---

## Scaling & Load Balancing

### Horizontal Scaling

```bash
# Deploy multiple API instances
docker-compose scale api=3

# Or with Kubernetes
kubectl scale deployment api --replicas=3
```

### Load Balancer Configuration (Nginx)

```nginx
upstream api_backend {
    server api-1:3333;
    server api-2:3333;
    server api-3:3333;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
    }
}
```

---

## Database Connection Pooling

### PgBouncer Configuration

```ini
[databases]
auth_app = host=postgres user=app_user password=app_password dbname=auth_app

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
```

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run health-check

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push API
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/api/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_REGISTRY }}/api:latest

      - name: Build and push Web
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/web/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_REGISTRY }}/web:latest

      - name: Deploy to production
        run: |
          ssh ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} \
            'cd /app && docker-compose -f docker-compose.prod.yml pull && \
             docker-compose -f docker-compose.prod.yml up -d'
```

---

## Rollback Procedure

If deployment fails or issues occur:

```bash
# Identify last working version
docker ps -a | grep api

# Revert to previous version
docker-compose -f docker-compose.prod.yml down
docker rmi your-registry/api:latest your-registry/web:latest
docker pull your-registry/api:previous-tag
docker pull your-registry/web:previous-tag

# Restart with previous version
docker-compose -f docker-compose.prod.yml up -d
```

---

## Performance Optimization

### API Optimization

- Enable compression: `npm install @nestjs/compression`
- Use caching strategies
- Optimize database queries
- Implement rate limiting (already done)

### Web Optimization

- Enable Next.js static optimization
- Configure image optimization
- Implement caching headers
- Use CDN for static assets

### Database Optimization

- Create indexes on frequently queried columns
- Vacuum and analyze tables regularly
- Monitor slow queries

---

## Security Hardening

### API Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Security headers configured (Helmet.js)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] JWT secret is strong and unique
- [ ] No sensitive data in logs
- [ ] Database backups encrypted

### Web Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Content Security Policy configured
- [ ] No hardcoded API keys
- [ ] Credentials not stored in localStorage
- [ ] CSRF protection enabled (Next.js built-in)

---

## Runbook: Incident Response

### API is Down

1. Check container status: `docker ps`
2. Check logs: `docker logs <api-container>`
3. Check database connection: `psql <connection-string>`
4. Restart container: `docker restart <api-container>`
5. If issue persists, rollback to previous version

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check connection string in environment variables
3. Verify database user has correct permissions
4. Check firewall rules
5. Review database logs

### High Error Rate

1. Check logs for error messages
2. Monitor database performance
3. Check rate limiting stats
4. Review recent deployments
5. Consider rollback if recent change

---

## Post-Deployment Verification

After deploying to production:

```bash
# 1. Health check
curl https://api.example.com/api

# 2. Run smoke tests
npm run e2e:all -- --env=production

# 3. Monitor logs for errors
docker logs -f <api-container> | grep -i error

# 4. Monitor application metrics
# (Check your monitoring service)

# 5. User acceptance testing
# Have team test critical flows

# 6. Performance check
# Run Lighthouse or similar tool
```

---

## References

- [NestJS Deployment Documentation](https://docs.nestjs.com/deployment)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/getting-started/setup-prisma/deploy)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Production Setup](https://www.postgresql.org/docs/current/manage-ag-production.html)

---

**Last Updated**: 2025-12-07  
**Version**: 1.0  
**Maintainer**: Project Team
