#!/bin/bash
# =============================================================================
# Azure Infrastructure Provisioning Script
# Creates all required resources for Container Apps + Neon deployment
# =============================================================================
#
# Prerequisites:
#   - Azure CLI installed (2.75.0+ for Neon extension)
#   - Logged in: az login
#   - Subscription set: az account set --subscription <id>
#
# Usage:
#   ./scripts/azure-provision.sh [environment]
#   ./scripts/azure-provision.sh dev
#   ./scripts/azure-provision.sh staging
#   ./scripts/azure-provision.sh prod
# =============================================================================

set -e  # Exit on error

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
ENV="${1:-dev}"
PROJECT_NAME="authapp"
LOCATION="${2:-westus3}"  # Neon available: eastus2, germanywestcentral, westus3

# Resource naming (customize as needed)
RESOURCE_GROUP="rg-${PROJECT_NAME}-${ENV}-${LOCATION}"
ACR_NAME="${PROJECT_NAME}${ENV}wus3acr"  # Must be globally unique, alphanumeric only
NEON_ORG_NAME="${PROJECT_NAME}-${ENV}-neon"
NEON_PROJECT_NAME="${PROJECT_NAME}-${ENV}"
CONTAINER_ENV_NAME="${PROJECT_NAME}-${ENV}-env"
API_APP_NAME="${PROJECT_NAME}-${ENV}-api"
WEB_APP_NAME="${PROJECT_NAME}-${ENV}-web"

echo "=============================================="
echo "Azure Infrastructure Provisioning"
echo "=============================================="
echo "Environment: ${ENV}"
echo "Location: ${LOCATION}"
echo "Resource Group: ${RESOURCE_GROUP}"
echo "=============================================="

# -----------------------------------------------------------------------------
# Step 1: Create Resource Group
# -----------------------------------------------------------------------------
echo ""
echo "[1/7] Creating Resource Group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

# -----------------------------------------------------------------------------
# Step 2: Create Azure Container Registry
# -----------------------------------------------------------------------------
echo ""
echo "[2/7] Creating Azure Container Registry..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --output table

# Get ACR credentials
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)

echo "ACR Login Server: ${ACR_LOGIN_SERVER}"

# -----------------------------------------------------------------------------
# Step 3: Database Setup (Neon Serverless Postgres)
# -----------------------------------------------------------------------------
echo ""
echo "[3/7] Database Setup..."
echo ""
echo "NOTE: Neon free plan is no longer available via Azure Marketplace."
echo "Please set up your database using one of these options:"
echo ""
echo "Option A - Neon (Recommended for serverless):"
echo "  1. Sign up at https://neon.tech"
echo "  2. Create a project in ${LOCATION} region"
echo "  3. Copy the connection string"
echo ""
echo "Option B - Azure Database for PostgreSQL Flexible Server:"
echo "  az postgres flexible-server create \\"
echo "    --resource-group ${RESOURCE_GROUP} \\"
echo "    --name ${PROJECT_NAME}-${ENV}-postgres \\"
echo "    --location ${LOCATION} \\"
echo "    --tier Burstable --sku-name Standard_B1ms \\"
echo "    --storage-size 32 --version 16 \\"
echo "    --admin-user adminuser --admin-password <YOUR_PASSWORD>"
echo ""

# Placeholder DATABASE_URL - user must update this
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/authdb?sslmode=require"
echo "Using placeholder DATABASE_URL. Update Container App environment variables after setup."

# -----------------------------------------------------------------------------
# Step 4: Create Container Apps Environment
# -----------------------------------------------------------------------------
echo ""
echo "[4/6] Creating Container Apps Environment..."
az containerapp env create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_ENV_NAME" \
  --location "$LOCATION" \
  --output table

# -----------------------------------------------------------------------------
# Step 5: Create API Container App
# -----------------------------------------------------------------------------
echo ""
echo "[5/6] Creating API Container App..."

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

az containerapp create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$API_APP_NAME" \
  --environment "$CONTAINER_ENV_NAME" \
  --image "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" \
  --target-port 3333 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 10 \
  --env-vars \
    "NODE_ENV=production" \
    "PORT=3333" \
    "DATABASE_URL=${DATABASE_URL}" \
    "JWT_SECRET=${JWT_SECRET}" \
    "JWT_EXPIRATION=1h" \
  --output table

# Get API FQDN
API_FQDN=$(az containerapp show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$API_APP_NAME" \
  --query "properties.configuration.ingress.fqdn" -o tsv)

echo "API FQDN: https://${API_FQDN}"

# -----------------------------------------------------------------------------
# Step 6: Create Web Container App
# -----------------------------------------------------------------------------
echo ""
echo "[6/6] Creating Web Container App..."
az containerapp create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEB_APP_NAME" \
  --environment "$CONTAINER_ENV_NAME" \
  --image "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 5 \
  --env-vars \
    "NODE_ENV=production" \
    "PORT=3000" \
    "HOSTNAME=0.0.0.0" \
  --output table

# Get Web FQDN
WEB_FQDN=$(az containerapp show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEB_APP_NAME" \
  --query "properties.configuration.ingress.fqdn" -o tsv)

echo "Web FQDN: https://${WEB_FQDN}"

# -----------------------------------------------------------------------------
# Post-Setup: Update API with ALLOWED_ORIGINS
# -----------------------------------------------------------------------------
echo ""
echo "Updating API with CORS configuration..."
az containerapp update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$API_APP_NAME" \
  --set-env-vars "ALLOWED_ORIGINS=https://${WEB_FQDN}" \
  --output table

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "=============================================="
echo "Infrastructure Provisioning Complete!"
echo "=============================================="
echo ""
echo "Resources Created:"
echo "  - Resource Group: ${RESOURCE_GROUP}"
echo "  - Container Registry: ${ACR_LOGIN_SERVER}"
echo "  - Container Environment: ${CONTAINER_ENV_NAME}"
echo "  - API App: ${API_APP_NAME}"
echo "  - Web App: ${WEB_APP_NAME}"
echo ""
echo "URLs:"
echo "  - API: https://${API_FQDN}"
echo "  - Web: https://${WEB_FQDN}"
echo ""
echo "GitHub Secrets to Configure:"
echo "  AZURE_CREDENTIALS     - Run: az ad sp create-for-rbac --sdk-auth"
echo "  ACR_LOGIN_SERVER      - ${ACR_LOGIN_SERVER}"
echo "  ACR_USERNAME          - ${ACR_USERNAME}"
echo "  ACR_PASSWORD          - (see Azure Portal)"
echo "  AZURE_RESOURCE_GROUP  - ${RESOURCE_GROUP}"
echo "  AZURE_CONTAINER_APP_API - ${API_APP_NAME}"
echo "  AZURE_CONTAINER_APP_WEB - ${WEB_APP_NAME}"
echo "  NEXT_PUBLIC_API_URL   - https://${API_FQDN}/api"
echo "  API_HEALTH_URL        - https://${API_FQDN}/api/health"
echo "  WEB_HEALTH_URL        - https://${WEB_FQDN}"
echo ""
echo "IMPORTANT - Database Setup Required:"
echo "  The API is using a placeholder DATABASE_URL."
echo "  Update it with your actual connection string:"
echo "  az containerapp update --resource-group ${RESOURCE_GROUP} \\"
echo "    --name ${API_APP_NAME} --set-env-vars \"DATABASE_URL=<your-connection-string>\""
echo ""
echo "Next Steps:"
echo "  1. Set up database (Neon at neon.tech or Azure PostgreSQL)"
echo "  2. Update API DATABASE_URL with actual connection string"
echo "  3. Build and push images: docker build & az acr login & docker push"
echo "  4. Update container apps with your images"
echo "  5. Run database migrations: npx prisma migrate deploy"
echo "=============================================="
