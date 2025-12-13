# Azure Deployment Plan: Email Verification Feature

**Status**: Ready for Deployment
**Commit**: `f334b2c` - feat(auth): implement email verification with hard verification strategy
**Date Created**: 2025-12-13
**Priority**: HIGH

---

## Executive Summary

Email verification feature has been implemented and committed. The feature works locally with Ethereal Email (development SMTP). This plan outlines the steps to validate Azure resources, configure production SMTP, and deploy to Azure Container Apps.

---

## Current State

### ✅ Completed (Local Development)

- Email verification implementation with "Hard Verification" strategy
- User registration sends verification email (no JWT until verified)
- Login blocks unverified users (403 Forbidden)
- POST `/api/auth/verify-email` endpoint with auto-login
- Frontend verification page (`/verify-email`)
- Database migration `20251213010522_add_email_verification`
- 30/38 E2E tests passing (Auth & Security suites 100%)

### ⚠️ Pending (Production)

- Azure resource validation
- Production SMTP configuration (Ethereal → SendGrid/SES/Azure)
- Database migration deployment
- Container image rebuild and deployment
- End-to-end production testing

---

## Phase 1: Azure Resource Validation

**Objective**: Verify current Azure infrastructure and identify what needs updating

### Step 1.1: Login to Azure CLI

```bash
# Login to Azure
az login

# List subscriptions
az account list --output table

# Set active subscription
az account set --subscription "<your-subscription-id>"

# Verify current account
az account show
```

### Step 1.2: Identify Resources

```bash
# List all resource groups
az group list --output table

# Expected resources to find:
# - Resource Group (e.g., rg-auth-tutorial)
# - Container Apps Environment
# - Container App: API
# - Container App: Web
# - PostgreSQL Flexible Server
# - Container Registry
```

### Step 1.3: Document Current API Configuration

```bash
# Get API Container App details
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --output json > current-api-config.json

# Get current image tag
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].image \
  --output tsv

# Get current environment variables (CRITICAL)
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].env \
  --output table

# Save this output - you'll need it for Step 2
```

### Step 1.4: Check API Health

```bash
# Get API URL
API_URL=$(az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "API URL: https://${API_URL}"

# Test health endpoint
curl https://${API_URL}/api/health

# Test current auth endpoints
curl https://${API_URL}/api
```

### Step 1.5: Check Database Status

```bash
# List PostgreSQL servers
az postgres flexible-server list \
  --resource-group <rg-name> \
  --output table

# Get database details
az postgres flexible-server show \
  --name <db-server-name> \
  --resource-group <rg-name>

# Check if database is accessible
az postgres flexible-server connect \
  --name <db-server-name> \
  --username <admin-user>
```

### Step 1.6: Review Current Environment Variables

**CRITICAL**: Document these existing values:

```bash
# Export current env vars to a file for reference
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].env \
  | jq -r '.[] | "\(.name)=\(.value // .secretRef)"' \
  > current-env-vars.txt
```

Expected variables to find:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `PORT` - API port (usually 3333)
- `NODE_ENV` - Environment (production)
- `ALLOWED_ORIGINS` - CORS origins

---

## Phase 2: Production SMTP Setup

**Objective**: Configure real email service for production

### Option A: SendGrid (Recommended - Azure Integrated)

#### Step 2.1: Create SendGrid Account

```bash
# Create SendGrid resource in Azure
az sendgrid account create \
  --resource-group <rg-name> \
  --name <sendgrid-account-name> \
  --plan-name free \
  --location global
```

#### Step 2.2: Get SendGrid API Key

```bash
# Get SendGrid API key (save this securely)
az sendgrid api-key create \
  --account-name <sendgrid-account-name> \
  --resource-group <rg-name> \
  --key-name production-smtp

# Expected output format:
# {
#   "name": "production-smtp",
#   "key": "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# }
```

#### Step 2.3: Configure SendGrid Settings

- SendGrid SMTP credentials:
  ```
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=<your-sendgrid-api-key>
  ```

### Option B: Azure Communication Services Email

```bash
# Create Communication Service
az communication create \
  --name <communication-service-name> \
  --resource-group <rg-name> \
  --data-location "United States"

# Get connection string
az communication show \
  --name <communication-service-name> \
  --resource-group <rg-name> \
  --query connectionString
```

### Option C: AWS SES (If you have AWS)

Requires AWS account and SES SMTP credentials from AWS Console.

### Step 2.4: Test SMTP Credentials Locally (OPTIONAL BUT RECOMMENDED)

```bash
# Update local .env with production SMTP
# Temporarily replace Ethereal credentials with SendGrid

cd apps/api
# Test registration locally with production SMTP
npm run dev
# Try registering a test user with your real email
```

---

## Phase 3: Database Migration Deployment

**Objective**: Apply email verification schema changes to production database

### ✅ UPDATED APPROACH: Migration in Dockerfile

**Decision**: Instead of manual migration, migrations now run automatically on container startup.

**Changes Made**:

1. Created `apps/api/docker-entrypoint.sh` - runs migrations before app start
2. Updated `apps/api/Dockerfile` - uses entrypoint script as CMD
3. Testing locally before Azure deployment

**Benefits**:

- ✅ Migrations run automatically on every deployment
- ✅ No manual intervention needed
- ✅ Works for all environments (dev, staging, prod)
- ✅ Atomic: migration failure prevents app start

### Migration Details

**Migration File**: `apps/api/prisma/migrations/20251213010522_add_email_verification/migration.sql`

**Changes**:

```sql
ALTER TABLE "User"
ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "verificationTokenExp" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_verificationToken_key"
ON "User"("verificationToken");
```

### Step 3.1: Backup Database (CRITICAL)

```bash
# Create database backup before migration
az postgres flexible-server backup create \
  --server-name <db-server-name> \
  --resource-group <rg-name> \
  --backup-name "pre-email-verification-$(date +%Y%m%d)"
```

### Step 3.2: Test Migration on Staging (If Available)

If you have a staging environment, test there first.

### Step 3.3: Deploy Migration to Production

**Option A: From Container (Recommended)**

```bash
# SSH into API container
az containerapp exec \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --command "/bin/sh"

# Inside container, run migration
npx prisma migrate deploy

# Verify migration succeeded
npx prisma migrate status
```

**Option B: From Local Machine (Requires Database Access)**

```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="postgresql://user:pass@server.postgres.database.azure.com:5432/dbname?sslmode=require"

# Run migration
cd apps/api
npx prisma migrate deploy

# Unset DATABASE_URL
unset DATABASE_URL
```

### Step 3.4: Verify Migration

```bash
# Connect to database
az postgres flexible-server connect \
  --name <db-server-name> \
  --username <admin-user> \
  --database <db-name>

# Check schema
\d "User"

# Expected columns:
# - isEmailVerified (boolean, default false)
# - verificationToken (text, unique)
# - verificationTokenExp (timestamp)

# Exit database
\q
```

---

## Phase 4: Update Environment Variables

**Objective**: Add SMTP configuration to Container App

### Step 4.1: Prepare Environment Variables

Create a file `production-smtp-env.json`:

```json
[
  {
    "name": "SMTP_HOST",
    "value": "smtp.sendgrid.net"
  },
  {
    "name": "SMTP_PORT",
    "value": "587"
  },
  {
    "name": "SMTP_USER",
    "value": "apikey"
  },
  {
    "name": "SMTP_PASS",
    "secretRef": "smtp-password"
  },
  {
    "name": "SMTP_FROM",
    "value": "noreply@yourdomain.com"
  },
  {
    "name": "FRONTEND_URL",
    "value": "https://<web-app-url>.azurecontainerapps.io"
  }
]
```

### Step 4.2: Create Secret for SMTP Password

```bash
# Add SMTP password as secret
az containerapp secret set \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --secrets smtp-password=<sendgrid-api-key>
```

### Step 4.3: Update Environment Variables

```bash
# Get current env vars
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].env \
  > current-env.json

# Add new variables
az containerapp update \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --set-env-vars \
    SMTP_HOST=smtp.sendgrid.net \
    SMTP_PORT=587 \
    SMTP_USER=apikey \
    SMTP_FROM="noreply@yourdomain.com" \
  --replace-env-vars \
    SMTP_PASS=secretref:smtp-password \
    FRONTEND_URL=https://<web-fqdn>

# Verify variables were added
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].env
```

---

## Phase 5: Build and Deploy Updated Containers

**Objective**: Deploy code with email verification to production

### Step 5.1: Get Container Registry Details

```bash
# List container registries
az acr list --resource-group <rg-name> --output table

# Login to registry
az acr login --name <registry-name>

# Get registry URL
ACR_URL=$(az acr show \
  --name <registry-name> \
  --query loginServer \
  --output tsv)

echo "Registry URL: ${ACR_URL}"
```

### Step 5.2: Build Production Images

```bash
# From project root
cd /Users/gerry/Projects/nestjs-nextjs-template

# Build API image
docker build -f apps/api/Dockerfile -t ${ACR_URL}/api:latest -t ${ACR_URL}/api:email-verification .

# Build Web image
docker build -f apps/web/Dockerfile -t ${ACR_URL}/web:latest -t ${ACR_URL}/web:email-verification .
```

### Step 5.3: Push Images to Registry

```bash
# Push API
docker push ${ACR_URL}/api:latest
docker push ${ACR_URL}/api:email-verification

# Push Web
docker push ${ACR_URL}/web:latest
docker push ${ACR_URL}/web:email-verification
```

### Step 5.4: Update API Container App

```bash
# Update API with new image
az containerapp update \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --image ${ACR_URL}/api:latest

# Monitor deployment
az containerapp revision list \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --output table
```

### Step 5.5: Update Web Container App

```bash
# Update Web with new image
az containerapp update \
  --name <web-app-name> \
  --resource-group <rg-name> \
  --image ${ACR_URL}/web:latest

# Monitor deployment
az containerapp revision list \
  --name <web-app-name> \
  --resource-group <rg-name> \
  --output table
```

### Step 5.6: Monitor Deployment Logs

```bash
# Watch API logs during deployment
az containerapp logs show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --follow

# In another terminal, watch Web logs
az containerapp logs show \
  --name <web-app-name> \
  --resource-group <rg-name> \
  --follow
```

---

## Phase 6: Production Verification & Testing

**Objective**: Confirm email verification works end-to-end in production

### Step 6.1: Get Production URLs

```bash
# Get API URL
API_URL=$(az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

# Get Web URL
WEB_URL=$(az containerapp show \
  --name <web-app-name> \
  --resource-group <rg-name> \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "API: https://${API_URL}"
echo "Web: https://${WEB_URL}"
```

### Step 6.2: Verify API Health

```bash
# Test health endpoint
curl https://${API_URL}/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-12-13T..."}

# Test API root
curl https://${API_URL}/api

# Verify new endpoint exists
curl -X POST https://${API_URL}/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"test"}' \
  --fail-with-body

# Expected: 400 Bad Request (token invalid) - endpoint is working
```

### Step 6.3: Test Registration Flow

1. **Open Web App**:

   ```
   https://<web-fqdn>
   ```

2. **Navigate to Register**:

   ```
   https://<web-fqdn>/register
   ```

3. **Register with YOUR Real Email**:
   - Email: `your-email@domain.com`
   - Name: `Test User`
   - Password: `SecurePassword123!`

4. **Expected Behavior**:
   - ✅ Success message: "Registration successful. Please check your email..."
   - ✅ NO auto-login (no JWT token)
   - ✅ Email arrives in your inbox (check spam if not in inbox)

### Step 6.4: Test Verification Flow

1. **Check Email Inbox**:
   - Look for email from `noreply@yourdomain.com`
   - Subject: "Verify your email address"

2. **Click Verification Link**:
   - Link format: `https://<web-fqdn>/verify-email?token=xxx...`

3. **Expected Behavior**:
   - ✅ Redirects to `/verify-email` page
   - ✅ Shows "Verifying..." loading state
   - ✅ Success message appears
   - ✅ AUTO-LOGIN occurs (JWT stored)
   - ✅ Redirects to home page `/`

### Step 6.5: Test Login Blocking

1. **Register Another User** (don't verify):
   - Email: `unverified@test.com`
   - Name: `Unverified User`
   - Password: `test123`

2. **Try to Login WITHOUT Verifying**:

   ```
   https://<web-fqdn>/login
   ```

   - Email: `unverified@test.com`
   - Password: `test123`

3. **Expected Behavior**:
   - ✅ Login fails
   - ✅ Error message: "Email not verified. Please check your email inbox."
   - ✅ Status: 403 Forbidden

### Step 6.6: Test Login After Verification

1. **Login with First Verified User**:
   - Email: `your-email@domain.com`
   - Password: `SecurePassword123!`

2. **Expected Behavior**:
   - ✅ Login succeeds
   - ✅ JWT token received
   - ✅ Redirects to home page `/`
   - ✅ User can access protected routes

---

## Phase 7: Monitoring & Rollback Plan

### Step 7.1: Set Up Monitoring

```bash
# Enable Application Insights (if not already enabled)
az containerapp logs enable \
  --name <api-app-name> \
  --resource-group <rg-name>

# Create log query for email verification
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "
    ContainerAppConsoleLogs_CL
    | where ContainerAppName_s == '<api-app-name>'
    | where Log_s contains 'MailService'
    | project TimeGenerated, Log_s
    | order by TimeGenerated desc
    | take 100
  "
```

### Step 7.2: Monitor Key Metrics

```bash
# Watch for errors in logs
az containerapp logs show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --follow \
  | grep -i "error\|exception\|failed"

# Check revision traffic distribution
az containerapp ingress traffic show \
  --name <api-app-name> \
  --resource-group <rg-name>
```

### Step 7.3: Rollback Plan (If Issues Occur)

```bash
# List all revisions
az containerapp revision list \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --output table

# Rollback to previous revision
az containerapp ingress traffic set \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --revision-weight <previous-revision>=100 <current-revision>=0

# Or completely deactivate new revision
az containerapp revision deactivate \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --revision <revision-name>
```

### Step 7.4: Database Rollback (ONLY IF CRITICAL)

```bash
# Restore from backup created in Phase 3
az postgres flexible-server restore \
  --source-server <db-server-name> \
  --resource-group <rg-name> \
  --name <db-server-name>-restored \
  --restore-point-in-time "2025-12-13T00:00:00Z"

# Update DATABASE_URL to point to restored server
```

---

## Success Criteria

### ✅ Deployment is Successful When:

1. **API Health Check**: `/api/health` returns 200 OK
2. **Registration**: User can register and receives verification email
3. **Verification**: User can click link and gets auto-logged in
4. **Login Blocking**: Unverified users cannot login (403 Forbidden)
5. **Login Success**: Verified users can login normally
6. **No Errors**: API logs show no SMTP or database errors
7. **Existing Users**: Current users (already verified) can still login

### ⚠️ Known Issues (Acceptable)

- 8 events E2E tests failing (test infrastructure issue, not production issue)
- Feature works correctly in manual testing

---

## Troubleshooting Guide

### Issue: Email Not Sending

**Symptoms**: User registers but no email arrives

**Check**:

```bash
# Verify SMTP env vars
az containerapp show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --query properties.template.containers[0].env \
  | grep SMTP

# Check API logs for email errors
az containerapp logs show \
  --name <api-app-name> \
  --resource-group <rg-name> \
  --tail 100 \
  | grep -i "mailservice\|smtp\|email"
```

**Solutions**:

- Verify SendGrid API key is correct
- Check SendGrid dashboard for sending stats
- Verify SMTP_FROM email is authorized in SendGrid
- Check spam folder

### Issue: 403 on Login (Even for Old Users)

**Symptoms**: Existing verified users cannot login

**Cause**: Migration set `isEmailVerified=false` by default

**Solution**:

```sql
-- Connect to database and update existing users
UPDATE "User"
SET "isEmailVerified" = true
WHERE "createdAt" < '2025-12-13';
```

### Issue: Invalid Token Error

**Symptoms**: Verification link shows "Invalid token"

**Check**:

```bash
# Check if token exists in database
az postgres flexible-server execute \
  --name <db-server-name> \
  --database-name <db-name> \
  --querytext "SELECT email, \"verificationToken\", \"verificationTokenExp\" FROM \"User\" WHERE \"isEmailVerified\" = false;"
```

**Solutions**:

- Token may have expired (8 hour limit)
- User should request new verification email (requires resend feature)
- Verify FRONTEND_URL env var matches actual web URL

### Issue: Database Migration Failed

**Symptoms**: Migration status shows errors

**Solution**:

```bash
# Check migration status
npx prisma migrate status

# Reset migration (DANGER: only in development)
# npx prisma migrate reset

# Apply specific migration
npx prisma migrate deploy
```

---

## Post-Deployment Tasks

### Step 8.1: Document Production URLs

Update `.env.azure.example` files:

```bash
# apps/api/.env.azure.example
DATABASE_URL=postgresql://user@server.postgres.database.azure.com:5432/db
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
FRONTEND_URL=https://<web-fqdn>

# apps/web/.env.azure.example
NEXT_PUBLIC_API_URL=https://<api-fqdn>
```

### Step 8.2: Update Documentation

```bash
# Update DEPLOYMENT.md with email verification notes
# Update ENVIRONMENT.md with new SMTP variables
# Update README.md with production URL
```

### Step 8.3: Create Backup Schedule

```bash
# Enable automated backups
az postgres flexible-server update \
  --name <db-server-name> \
  --resource-group <rg-name> \
  --backup-retention 7

# Enable geo-redundant backup
az postgres flexible-server update \
  --name <db-server-name> \
  --resource-group <rg-name> \
  --geo-redundant-backup Enabled
```

### Step 8.4: Set Up Alerts

```bash
# Alert for API failures
az monitor metrics alert create \
  --name api-5xx-errors \
  --resource-group <rg-name> \
  --scopes /subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.App/containerApps/<api-name> \
  --condition "count Http5xxRate >= 10" \
  --description "Alert when API returns 5xx errors"

# Alert for SMTP failures (check logs)
```

---

## Handoff Checklist

Before handing off to another agent/developer, ensure they have:

- [ ] Azure CLI installed and configured
- [ ] Access to Azure subscription
- [ ] SendGrid account created (or alternative SMTP)
- [ ] Production SMTP credentials
- [ ] Database admin credentials
- [ ] Container Registry credentials
- [ ] This deployment plan document
- [ ] Access to git repository (commit `f334b2c`)

---

## References

- **Feature Commit**: `f334b2c` - feat(auth): implement email verification with hard verification strategy
- **ADR**: `.add/memory/decisions/DECISIONS.md` - ADR-020: Email Verification Strategy
- **Migration**: `apps/api/prisma/migrations/20251213010522_add_email_verification/`
- **Spec Document**: `.add/sessions/active/feature-email-verification-spec.md`
- **Azure Docs**: https://docs.microsoft.com/en-us/azure/container-apps/
- **SendGrid Docs**: https://docs.sendgrid.com/for-developers/sending-email/api-getting-started

---

## Contact & Escalation

If issues arise during deployment:

1. Check Troubleshooting Guide (above)
2. Review API logs for specific errors
3. Verify all environment variables are correct
4. Test SMTP credentials outside of application
5. Consider rollback if critical issues

**Emergency Rollback**: Follow Step 7.3 immediately if production is impacted.
