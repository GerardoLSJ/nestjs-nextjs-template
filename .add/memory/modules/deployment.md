# Deployment & Infrastructure

<!-- @confidence: 0.9 -->
<!-- @verified: 2025-12-11 -->
<!-- @source: manual-audit -->

> **Trigger Keywords**: deploy, deployment, azure, docker, container, ci/cd, infrastructure, production, staging, logs, monitoring
> **~1800 tokens** | Last Updated: 2025-12-11

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 Azure Container Apps Environment                 │
│                                                                 │
│  ┌─────────────────────┐        ┌─────────────────────┐        │
│  │   Container App 1   │        │   Container App 2   │        │
│  │     NestJS API      │◄──────►│    Next.js Web      │        │
│  │       :3333         │  FQDN  │       :3000         │        │
│  │  min: 0, max: 10    │        │  min: 1, max: 5     │        │
│  └──────────┬──────────┘        └──────────┬──────────┘        │
└─────────────┼───────────────────────────────┼──────────────────┘
              ▼                               ▼
    api.{env}.azurecontainerapps.io    web.{env}.azurecontainerapps.io
              │
              ▼
┌─────────────────────────────┐
│  Azure PostgreSQL Flexible  │
│     authapp-dev-postgres    │
│        Port 5432            │
└─────────────────────────────┘
```

## Key Resources (Dev Environment)

| Resource              | Name                                               | Purpose                     |
| --------------------- | -------------------------------------------------- | --------------------------- |
| Resource Group        | `rg-authapp-dev-westus3`                           | Container for all resources |
| Container Registry    | `authappdevwus3acr.azurecr.io`                     | Docker image storage        |
| Container Environment | `authapp-dev-env`                                  | Shared environment          |
| API Container App     | `authapp-dev-api`                                  | NestJS backend              |
| Web Container App     | `authapp-dev-web`                                  | Next.js frontend            |
| PostgreSQL            | `authapp-dev-postgres.postgres.database.azure.com` | Database                    |

## Docker Strategy

### Multi-Stage Builds

Both API and Web use optimized multi-stage Dockerfiles:

```dockerfile
# Pattern: deps → builder → production
FROM node:20-alpine AS deps
# Install dependencies only

FROM node:20-alpine AS builder
# Build the application

FROM node:20-alpine AS production
# Minimal runtime image with non-root user
```

### Key Files

- `apps/api/Dockerfile` - NestJS API container
- `apps/web/Dockerfile` - Next.js standalone container
- `.dockerignore` - Excludes node_modules, .git, tests
- `docker-compose.prod.yml` - Local production testing

### Build Commands

```bash
# Build API
docker build -t api:latest -f apps/api/Dockerfile .

# Build Web (with API URL)
docker build -t web:latest -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api .
```

## CI/CD Pipeline

### GitHub Actions Workflow

`.github/workflows/deploy-azure.yml`:

1. **build-api**: Build → Push to ACR → Deploy to Container App
2. **build-web**: Build → Push to ACR → Deploy to Container App
3. **verify**: Health check both endpoints

### Required GitHub Secrets

```
AZURE_CREDENTIALS        - Service principal JSON
ACR_LOGIN_SERVER         - authappdevwus3acr.azurecr.io
ACR_USERNAME             - ACR admin username
ACR_PASSWORD             - ACR admin password
AZURE_RESOURCE_GROUP     - rg-authapp-dev-westus3
AZURE_CONTAINER_APP_API  - authapp-dev-api
AZURE_CONTAINER_APP_WEB  - authapp-dev-web
NEXT_PUBLIC_API_URL      - https://{api-fqdn}/api
API_HEALTH_URL           - https://{api-fqdn}/api/health
WEB_HEALTH_URL           - https://{web-fqdn}
```

## Environment Configuration

### API Environment Variables

```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://user:pass@host:5432/authdb?sslmode=require
JWT_SECRET=<32+ char secret>
JWT_EXPIRATION=1h
ALLOWED_ORIGINS=https://{web-fqdn}
```

### Web Environment Variables

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_API_URL=https://{api-fqdn}/api  # Build-time!
```

**Important**: `NEXT_PUBLIC_*` variables are embedded at build time in Next.js.

## Database Options

| Option                    | Use Case                    | Cost/Month |
| ------------------------- | --------------------------- | ---------- |
| Azure PostgreSQL Flexible | Production (always-on)      | $12-260    |
| Neon Serverless           | Dev/Staging (scale-to-zero) | $0-69      |

### Connection String Format

```
postgresql://adminuser:PASSWORD@authapp-dev-postgres.postgres.database.azure.com:5432/authdb?sslmode=require
```

## Provisioning

### Automated Script

```bash
./scripts/azure-provision.sh [env] [location]
./scripts/azure-provision.sh dev westus3
./scripts/azure-provision.sh prod eastus2
```

Creates: Resource Group, ACR, Container Apps Environment, API + Web apps.

### Manual Database Setup

```bash
az postgres flexible-server create \
  --resource-group rg-authapp-dev-westus3 \
  --name authapp-dev-postgres \
  --location westus3 \
  --tier Burstable --sku-name Standard_B1ms \
  --storage-size 32 --version 16 \
  --admin-user adminuser --admin-password <PASSWORD>
```

## Logging & Monitoring

### Azure CLI - Container App Logs

#### Stream Real-time Logs

```bash
az containerapp logs show \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --follow
```

The `--follow` flag streams logs in real-time (like `tail -f`).

#### Get Recent Logs

```bash
# Get last 100 lines
az containerapp logs show \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --tail 100
```

#### Logs from Specific Revision

```bash
# List revisions first
az containerapp revision list \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --query "[].{Name:name, Active:properties.active}" -o table

# Get logs from specific revision
az containerapp logs show \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --revision <revision-name>
```

#### Logs from Specific Container (if multiple containers)

```bash
az containerapp logs show \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --container <container-name>
```

### Azure Portal Access

#### Log Stream (Real-time)

1. **Azure Portal** → Search "**authapp-dev-api**"
2. Left sidebar → **Log stream**
3. View real-time console output from NestJS application

#### Application Insights (if configured)

1. Go to Container App → **Application Insights**
2. Select resource
3. Available views:
   - **Live Metrics** - Real-time performance
   - **Failures** - Exceptions and errors
   - **Performance** - Response times
   - **Logs** - KQL queries for detailed analysis

#### Log Analytics Queries

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "authapp-dev-api"
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
```

Common Application Insights queries:

```kusto
requests | where timestamp > ago(1h)
exceptions | where timestamp > ago(1h)
traces | where timestamp > ago(1h)
```

### Quick Troubleshooting

| Issue                   | Solution                                    |
| ----------------------- | ------------------------------------------- |
| Need to debug quickly   | Use `--follow` flag for real-time streaming |
| Looking for errors      | Use Application Insights → Failures         |
| Performance issues      | Application Insights → Performance          |
| Historical analysis     | Log Analytics with KQL queries              |
| Deployment verification | Check last 50 lines: `--tail 50`            |

### Check Container App Status

```bash
az containerapp show \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --query "{Name:name, Status:properties.provisioningState, FQDN:properties.configuration.ingress.fqdn}"
```

## Cost Optimization

- **API min-replicas: 0** - Scales to zero when idle
- **Web min-replicas: 1** - Always available for users
- **Burstable tier DB** - Cost-effective for dev/staging
- **Reserved pricing** - 40% discount for production (1-year)

## Health Checks

- **API**: `GET /api/health` → 200 OK
- **Web**: `GET /` → 200 OK

## Deployment Checklist

1. [ ] Database created and accessible
2. [ ] DATABASE_URL configured in Container App
3. [ ] Prisma migrations deployed: `npx prisma migrate deploy`
4. [ ] GitHub secrets configured
5. [ ] Push to main triggers deployment
6. [ ] Health checks pass

---

_Reference: [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md), [docs/ENVIRONMENT.md](../../docs/ENVIRONMENT.md)_
