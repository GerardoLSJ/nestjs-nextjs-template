# Azure Communication Services Migration Plan

**Status**: FUTURE PHASE - Not Yet Started
**Created**: 2025-12-13
**Priority**: MEDIUM
**Depends On**: Email verification feature deployed and tested with Ethereal

---

## Overview

This document outlines the plan to migrate from Ethereal Email (test SMTP) to Azure Communication Services for production-grade email delivery.

**Current State**: Using Ethereal Email for testing deployment
**Target State**: Azure Communication Services with verified domain

---

## Why Azure Communication Services?

### Advantages

- ✅ Native Azure integration (same resource group, monitoring, IAM)
- ✅ Built-in logging and monitoring via Azure Monitor
- ✅ Pay-as-you-go pricing (no monthly fee)
- ✅ RBAC and managed identity support
- ✅ High deliverability rates
- ✅ SLA-backed reliability

### Pricing

- **Email sends**: ~$0.025 per 1,000 emails
- **No base fee**: Only pay for what you use
- **Free tier**: First 1,000 emails/month free

Compare to SendGrid:

- SendGrid Free: 12,000 emails/month (then requires paid plan)
- ACS: Pay-per-email with no monthly commitment

---

## Prerequisites

Before starting migration:

1. **Domain Ownership**: You need a custom domain (e.g., `yourdomain.com`)
2. **Domain Access**: Ability to add DNS TXT records for verification
3. **Tested Feature**: Email verification working end-to-end with Ethereal

---

## Phase 1: Create Azure Communication Service

### Step 1.1: Create Communication Service Resource

```bash
# Create communication service
az communication create \
  --name authapp-dev-email \
  --resource-group rg-authapp-dev-westus3 \
  --data-location "United States"

# Get connection string (save securely)
az communication show \
  --name authapp-dev-email \
  --resource-group rg-authapp-dev-westus3 \
  --query primaryConnectionString \
  --output tsv
```

**Expected Output**:

```
endpoint=https://authapp-dev-email.communication.azure.com/;accesskey=xxx...
```

### Step 1.2: Create Email Service

```bash
# Create email communication service
az communication email create \
  --name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --location global \
  --data-location "United States"

# Link to communication service
az communication email domain link \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --communication-service authapp-dev-email
```

---

## Phase 2: Domain Verification

### Option A: Use Azure-Provided Domain (Quick Test)

Azure provides a free test domain like `xxx.azurecomm.net`:

```bash
# Get Azure-managed domain
az communication email domain list \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3
```

**Advantages**:

- ✅ No domain verification needed
- ✅ Works immediately
- ✅ Good for testing

**Disadvantages**:

- ⚠️ Cannot customize sender domain
- ⚠️ May have lower deliverability
- ⚠️ Not suitable for customer-facing production

### Option B: Verify Custom Domain (Production)

#### Step 2.1: Add Custom Domain

```bash
# Add custom domain
az communication email domain create \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --domain-name yourdomain.com
```

#### Step 2.2: Get Verification Records

```bash
# Get DNS verification records
az communication email domain show \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --domain-name yourdomain.com \
  --query verificationRecords
```

**Expected Output** (JSON):

```json
{
  "domain": {
    "type": "TXT",
    "name": "@",
    "value": "ms-domain-verification=xxx..."
  },
  "SPF": {
    "type": "TXT",
    "name": "@",
    "value": "v=spf1 include:spf.protection.outlook.com -all"
  },
  "DKIM": {
    "type": "CNAME",
    "name": "selector1._domainkey",
    "value": "selector1-xxx._domainkey.yourdomain.onmicrosoft.com"
  },
  "DKIM2": {
    "type": "CNAME",
    "name": "selector2._domainkey",
    "value": "selector2-xxx._domainkey.yourdomain.onmicrosoft.com"
  }
}
```

#### Step 2.3: Add DNS Records

In your DNS provider (Cloudflare, GoDaddy, Route53, etc.):

1. **Domain Verification TXT Record**:
   - Type: `TXT`
   - Name: `@` (or root domain)
   - Value: `ms-domain-verification=xxx...`

2. **SPF Record**:
   - Type: `TXT`
   - Name: `@`
   - Value: `v=spf1 include:spf.protection.outlook.com -all`

3. **DKIM Records** (both):
   - Type: `CNAME`
   - Names: `selector1._domainkey` and `selector2._domainkey`
   - Values: From Azure output

#### Step 2.4: Verify Domain

```bash
# Initiate verification (after DNS propagates - wait 5-30 minutes)
az communication email domain verify \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --domain-name yourdomain.com

# Check verification status
az communication email domain show \
  --email-service-name authapp-dev-email-service \
  --resource-group rg-authapp-dev-westus3 \
  --domain-name yourdomain.com \
  --query domainVerificationStatus
```

**Expected**: `"Verified"`

---

## Phase 3: Update Application Code

### Step 3.1: Install Azure SDK

```bash
cd apps/api
npm install @azure/communication-email
```

### Step 3.2: Create Azure Email Service (Alternative to SMTP)

**Option A: Use Azure Email SDK** (Recommended)

Create new file: `apps/api/src/mail/azure-mail.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { EmailClient } from '@azure/communication-email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureMailService {
  private emailClient: EmailClient;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_COMMUNICATION_CONNECTION_STRING'
    );
    this.emailClient = new EmailClient(connectionString);
  }

  async sendVerificationEmail(to: string, verificationUrl: string): Promise<void> {
    const message = {
      senderAddress: this.configService.get<string>('SMTP_FROM'),
      content: {
        subject: 'Verify your email address',
        html: `
          <h1>Welcome!</h1>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        `,
      },
      recipients: {
        to: [{ address: to }],
      },
    };

    const poller = await this.emailClient.beginSend(message);
    await poller.pollUntilDone();
  }
}
```

**Option B: Continue Using SMTP with ACS SMTP Service**

Azure Communication Services also provides SMTP endpoint:

```env
SMTP_HOST=<your-acs-name>.communication.azure.com
SMTP_PORT=587
SMTP_USER=<access-key-from-connection-string>
SMTP_PASS=<access-key-from-connection-string>
```

No code changes needed - just update environment variables!

---

## Phase 4: Update Environment Variables

### Step 4.1: Store Connection String as Secret

```bash
# Extract connection string
CONNECTION_STRING=$(az communication show \
  --name authapp-dev-email \
  --resource-group rg-authapp-dev-westus3 \
  --query primaryConnectionString \
  --output tsv)

# Store as Container App secret
az containerapp secret set \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --secrets azure-comm-connection-string="$CONNECTION_STRING"
```

### Step 4.2: Update Container App Environment Variables

**If using Azure SDK**:

```bash
az containerapp update \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --set-env-vars \
    AZURE_COMMUNICATION_CONNECTION_STRING=secretref:azure-comm-connection-string \
    SMTP_FROM="noreply@yourdomain.com"
```

**If using SMTP**:

```bash
# Get SMTP credentials from connection string
# Parse endpoint and access key

az containerapp update \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --set-env-vars \
    SMTP_HOST="<acs-endpoint>.communication.azure.com" \
    SMTP_PORT=587 \
    SMTP_USER=<access-key> \
    SMTP_PASS=secretref:azure-comm-connection-string \
    SMTP_FROM="noreply@yourdomain.com"
```

---

## Phase 5: Testing & Validation

### Step 5.1: Test Email Delivery

```bash
# Register test user in production
curl -X POST https://authapp-dev-api.lemonrock-c989340f.westus3.azurecontainerapps.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-real-email@gmail.com",
    "name": "Test User",
    "password": "TestPassword123!"
  }'

# Check your inbox for verification email
```

### Step 5.2: Monitor Email Delivery

```bash
# View email logs in Azure Monitor
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "
    AzureDiagnostics
    | where ResourceProvider == 'MICROSOFT.COMMUNICATION'
    | where Category == 'EmailSendMailOperational'
    | order by TimeGenerated desc
    | take 50
  "
```

### Step 5.3: Check Delivery Status

In Azure Portal:

1. Go to Communication Service → **Insights**
2. View metrics:
   - Email delivery success rate
   - Email send requests
   - Failed deliveries

---

## Phase 6: Cleanup Ethereal Configuration

### Step 6.1: Remove Ethereal Variables

```bash
# Remove old Ethereal environment variables
az containerapp update \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --remove-env-vars SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS
```

### Step 6.2: Update Documentation

- Update `docs/ENVIRONMENT.md` with ACS configuration
- Update `apps/api/.env.example` with new variables
- Document domain verification steps

---

## Cost Estimates

### Development/Testing (Low Volume)

- **0-1,000 emails/month**: $0 (free tier)
- **5,000 emails/month**: ~$0.10
- **10,000 emails/month**: ~$0.23

### Production (Medium Volume)

- **50,000 emails/month**: ~$1.15
- **100,000 emails/month**: ~$2.30
- **500,000 emails/month**: ~$11.50

**Total Monthly Cost** (with other Azure resources):

- Container Apps: ~$15-30
- PostgreSQL Flexible: ~$12
- Container Registry: ~$5
- Azure Communication Services: ~$1-5
- **Total**: ~$33-52/month

---

## Rollback Plan

If issues occur with Azure Communication Services:

### Quick Rollback to Ethereal

```bash
# Generate new Ethereal credentials
node scripts/generate-ethereal-creds.js

# Update Container App with Ethereal credentials
az containerapp update \
  --name authapp-dev-api \
  --resource-group rg-authapp-dev-westus3 \
  --set-env-vars \
    SMTP_HOST=smtp.ethereal.email \
    SMTP_PORT=587 \
    SMTP_USER=<ethereal-user> \
    SMTP_PASS=<ethereal-pass> \
    SMTP_FROM="noreply@ethereal.email"
```

### Alternative: Switch to SendGrid

Follow SendGrid setup instructions in main deployment plan.

---

## Success Criteria

Migration is successful when:

1. ✅ Domain verified in Azure Communication Services
2. ✅ Test email received in real inbox (not spam)
3. ✅ Email verification flow works end-to-end
4. ✅ Delivery metrics visible in Azure Monitor
5. ✅ No errors in Container App logs related to email
6. ✅ Email delivery rate > 95%

---

## References

- [Azure Communication Services Email Docs](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email)
- [Domain Verification Guide](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/add-custom-verified-domains)
- [SMTP with Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email-smtp/smtp-authentication)
- [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/details/communication-services/)

---

## Next Steps (When Ready)

1. Decide on domain strategy (Azure-provided vs custom domain)
2. Create Communication Service resource
3. Verify domain (if custom)
4. Update application code
5. Deploy and test
6. Monitor for 24 hours
7. Document learnings

---

**Status**: Ready to execute when Ethereal testing is complete and domain is available.
