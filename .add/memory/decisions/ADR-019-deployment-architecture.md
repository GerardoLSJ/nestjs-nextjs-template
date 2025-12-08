# ADR-019: Deployment Architecture

**Status**: ✅ ACCEPTED
**Date**: 2025-12-08

## Context

The project needed production-ready deployment infrastructure for:

- NestJS API backend (port 3333)
- Next.js Web frontend (port 3000)
- PostgreSQL database
- CI/CD automation

Requirements:

- Cost-effective for dev/staging environments
- Scalable for production
- Minimal operational overhead
- GitHub Actions integration

## Decision

**Use Azure Container Apps with Azure PostgreSQL Flexible Server**

### Architecture

```
GitHub Actions → Azure Container Registry → Container Apps
                                                ↓
                                    Azure PostgreSQL Flexible
```

### Components

| Component    | Choice                    | Rationale                                    |
| ------------ | ------------------------- | -------------------------------------------- |
| **Compute**  | Azure Container Apps      | Serverless, scale-to-zero, no K8s complexity |
| **Database** | Azure PostgreSQL Flexible | Native Azure, always-on reliability          |
| **Registry** | Azure Container Registry  | Integrated with Container Apps               |
| **CI/CD**    | GitHub Actions            | Repository-native, good Azure integration    |

## Rationale

### Why Azure Container Apps over alternatives?

| Option             | Pros                           | Cons                   | Verdict     |
| ------------------ | ------------------------------ | ---------------------- | ----------- |
| **Container Apps** | Serverless, auto-scale, simple | Limited customization  | ✅ Selected |
| App Service        | Simple, PaaS                   | No scale-to-zero       | ❌ Rejected |
| AKS (Kubernetes)   | Full control                   | Complex, expensive     | ❌ Rejected |
| AWS ECS/Fargate    | Mature                         | Cross-cloud complexity | ❌ Rejected |
| Vercel + Railway   | Developer-friendly             | Vendor lock-in         | ❌ Rejected |

### Why Azure PostgreSQL over Neon?

| Option               | Pros                                    | Cons                                  | Decision         |
| -------------------- | --------------------------------------- | ------------------------------------- | ---------------- |
| **Azure PostgreSQL** | Native Azure, always-on, no cold starts | No auto scale-to-zero                 | ✅ Production    |
| Neon Serverless      | Scale-to-zero, free tier, branching     | 500ms cold starts, marketplace issues | Consider for dev |

**Note**: Neon free plan via Azure Marketplace discontinued. Direct signup at neon.tech still available.

## Implementation

### Files Created

- `apps/api/Dockerfile` - Multi-stage NestJS build
- `apps/web/Dockerfile` - Multi-stage Next.js standalone build
- `.dockerignore` - Build optimization
- `.github/workflows/deploy-azure.yml` - CD pipeline
- `docker-compose.prod.yml` - Local production testing
- `scripts/azure-provision.sh` - Infrastructure automation
- `apps/api/.env.azure.example` - API env template
- `apps/web/.env.azure.example` - Web env template

### Infrastructure Provisioned (Dev)

- Resource Group: `rg-authapp-dev-westus3`
- Container Registry: `authappdevwus3acr.azurecr.io`
- API: `authapp-dev-api.lemonrock-c989340f.westus3.azurecontainerapps.io`
- Web: `authapp-dev-web.lemonrock-c989340f.westus3.azurecontainerapps.io`
- Database: `authapp-dev-postgres.postgres.database.azure.com`

## Cost Analysis

| Environment | Container Apps | Database                 | Total/Month |
| ----------- | -------------- | ------------------------ | ----------- |
| Dev         | ~$5-10         | ~$12 (B1ms)              | **~$20**    |
| Staging     | ~$15-25        | ~$25 (B2s)               | **~$45**    |
| Production  | ~$80-120       | ~$156 (D4ds v5 reserved) | **~$280**   |

## Consequences

### Positive

- ✅ Minimal operational overhead
- ✅ Cost-effective scaling (API scales to zero)
- ✅ Native Azure integration
- ✅ GitHub Actions CI/CD works out of the box
- ✅ Easy environment promotion (dev → staging → prod)

### Negative

- ⚠️ Azure vendor lock-in
- ⚠️ Database always-on (no scale-to-zero)
- ⚠️ Limited container customization vs full K8s

### Neutral

- Container Apps abstracts Kubernetes complexity
- Multi-stage Docker builds require careful optimization
- NEXT*PUBLIC*\* variables baked at build time

## Related Decisions

- ADR-002: PostgreSQL as database
- ADR-013: ADD Framework adoption

---

_This decision enables production deployment while maintaining cost efficiency for development environments._
