# Azure Infrastructure Diagnostics

**Module**: Azure Diagnostics & Investigation
**Version**: 1.0
**Last Updated**: 2025-12-09

## Overview

This module documents the process and commands for gathering comprehensive Azure infrastructure diagnostics and configurations using Azure CLI and Azure MCP Server.

## Diagnostic Investigation Process

### 1. Initial Resource Discovery

**Goal**: Identify all resources in a subscription/resource group

```bash
# List all subscriptions
az account list --output table

# Set active subscription
az account set --subscription <subscription-id>

# List resource groups
az group list --output table

# List all resources in a resource group
az resource list \
  --resource-group <resource-group-name> \
  --output table
```

**Key Information to Capture**:

- Subscription ID and name
- Tenant ID
- Resource group name and location
- All resource types in the group

### 2. Container Apps Diagnostics

**Goal**: Gather complete Container App configurations

```bash
# List all Container Apps
az containerapp list \
  --resource-group <resource-group-name> \
  --output json

# Get specific Container App details
az containerapp show \
  --name <app-name> \
  --resource-group <resource-group-name> \
  --output json

# Get revision history
az containerapp revision list \
  --name <app-name> \
  --resource-group <resource-group-name> \
  --output json

# Get Container Apps environment
az containerapp env show \
  --name <env-name> \
  --resource-group <resource-group-name> \
  --output json
```

**Key Information to Capture**:

- Container image and tag
- Environment variables (sanitize secrets!)
- Scaling configuration (min/max replicas)
- Resource allocation (CPU, memory)
- Ingress configuration (ports, FQDN, CORS)
- Identity configuration (managed identity)
- Secrets list (names only, not values)
- Current revision and health state
- Outbound IP addresses

### 3. Database Diagnostics (PostgreSQL)

**Goal**: Document database configuration and connectivity

```bash
# Get PostgreSQL server details
az postgres flexible-server show \
  --name <server-name> \
  --resource-group <resource-group-name> \
  --output json

# List databases
az postgres flexible-server db list \
  --resource-group <resource-group-name> \
  --server-name <server-name> \
  --output json

# Get firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group <resource-group-name> \
  --name <server-name> \
  --output json

# List server parameters
az postgres flexible-server parameter list \
  --resource-group <resource-group-name> \
  --server-name <server-name> \
  --output json
```

**Key Information to Capture**:

- FQDN and connection details
- PostgreSQL version
- SKU and tier (compute)
- Storage configuration
- Backup settings
- High availability configuration
- Authentication methods
- Network configuration (public/private)
- Firewall rules
- Database list

### 4. Container Registry Diagnostics

**Goal**: Document ACR configuration and images

```bash
# Get ACR details
az acr show \
  --name <registry-name> \
  --resource-group <resource-group-name> \
  --output json

# List repositories
az acr repository list \
  --name <registry-name> \
  --output json

# Get image tags for a repository
az acr repository show-tags \
  --name <registry-name> \
  --repository <repo-name> \
  --output json \
  --top 10 \
  --orderby time_desc

# Get manifests with digests
az acr repository show-manifests \
  --name <registry-name> \
  --repository <repo-name>
```

**Key Information to Capture**:

- Login server URL
- SKU tier
- Admin user status
- Public network access
- Security policies (soft delete, retention, trust)
- Repository list
- Recent image tags
- Storage usage

### 5. Monitoring & Logging

**Goal**: Document observability configuration

```bash
# Get Log Analytics workspace
az monitor log-analytics workspace show \
  --workspace-name <workspace-name> \
  --resource-group <resource-group-name> \
  --output json

# Get Application Insights (if used)
az monitor app-insights component show \
  --app <app-name> \
  --resource-group <resource-group-name> \
  --output json
```

**Key Information to Capture**:

- Workspace ID and customer ID
- Retention period
- Daily quota settings
- Public access configuration
- Linked services

### 6. Network Diagnostics

**Goal**: Document network topology and connectivity

```bash
# For VNet-integrated resources
az network vnet list \
  --resource-group <resource-group-name> \
  --output json

az network vnet subnet list \
  --resource-group <resource-group-name> \
  --vnet-name <vnet-name> \
  --output json

# Check private endpoints
az network private-endpoint list \
  --resource-group <resource-group-name> \
  --output json

# Check NSG rules
az network nsg list \
  --resource-group <resource-group-name> \
  --output json
```

**Key Information to Capture**:

- VNet and subnet configuration
- Private endpoints
- Public IP addresses
- DNS configuration
- Network security groups
- Route tables

## Using Azure MCP Server

### Available Commands

The Azure MCP Server provides higher-level commands for common operations:

```typescript
// List subscriptions
mcp__azure-mcp-server__subscription_list

// List resource groups
mcp__azure-mcp-server__group_list

// Container Apps operations
mcp__azure-mcp-server__appservice (requires learning mode first)

// PostgreSQL operations
mcp__azure-mcp-server__postgres

// Key Vault operations
mcp__azure-mcp-server__keyvault

// Azure Monitor operations
mcp__azure-mcp-server__monitor
```

### MCP Workflow

1. **Use `learn=true` first** to discover available commands
2. **Identify correct command** from the returned schema
3. **Execute with parameters** matching the schema

Example:

```typescript
// Step 1: Learn available commands
{
  "intent": "list postgresql servers",
  "learn": true
}

// Step 2: Execute specific command
{
  "intent": "list postgresql servers",
  "command": "postgres_server_list",
  "parameters": {
    "subscription": "xxx",
    "resource-group": "yyy",
    "user": "adminuser"
  }
}
```

## Documentation Structure

When creating infrastructure investigation reports, use this structure:

### 1. Executive Summary

- Date and time of investigation
- Subscription and resource group info
- High-level architecture overview
- Current status summary

### 2. Resource Inventory

- Table of all resources with type and status
- Visual architecture diagram (if complex)

### 3. Detailed Resource Configurations

For each resource type:

- Basic information (name, location, SKU)
- Configuration details
- Environment variables (sanitized)
- Scaling/sizing configuration
- Network configuration
- Security settings
- Current health status

### 4. Network Architecture

- DNS and endpoints
- Public vs private access
- Firewall rules
- VNet topology (if applicable)
- IP addresses (inbound/outbound)

### 5. Security Assessment

- Authentication methods
- Secret management approach
- Network security
- Recommendations and gaps

### 6. Diagnostics & Health

- Current health status
- Recent deployments
- Scaling behavior observations
- Performance notes

### 7. Useful Commands

- Common operations for each resource
- Troubleshooting commands
- Monitoring queries

### 8. Troubleshooting Guide

- Common issues and solutions
- Connection testing procedures
- Log query examples

### 9. Quick Reference

- Portal links
- Connection strings (sanitized)
- Resource IDs
- Contact information

## Security Considerations

### When Gathering Diagnostics

**DO**:

- Capture configuration structure
- Document firewall rules
- List environment variable names
- Note identity assignments
- Document network topology

**DON'T**:

- Include actual passwords or secrets
- Expose API keys or connection strings with credentials
- Share JWT secrets or encryption keys
- Reveal private keys or certificates
- Include database passwords in plain text

### Sanitizing Credentials

When documenting connection strings:

```bash
# Bad (exposed password)
postgresql://adminuser:MyPassword123!@server.postgres.database.azure.com:5432/db

# Good (sanitized)
postgresql://adminuser:<REDACTED>@server.postgres.database.azure.com:5432/db
```

When documenting environment variables:

```bash
# Bad
JWT_SECRET=k6drfXQzaRGQUMsh5ty+7Xi1hcBjBHrCInPWat1uqJI=

# Good
JWT_SECRET=<REDACTED> (Base64-encoded 256-bit key)
```

## Automation Scripts

### Complete Diagnostics Script

```bash
#!/bin/bash
# Azure Infrastructure Diagnostics Script

SUBSCRIPTION_ID="<subscription-id>"
RESOURCE_GROUP="<resource-group-name>"
OUTPUT_DIR="./azure-diagnostics-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUTPUT_DIR"

# Set subscription
az account set --subscription "$SUBSCRIPTION_ID"

# Resource inventory
az resource list \
  --resource-group "$RESOURCE_GROUP" \
  --output json > "$OUTPUT_DIR/resources.json"

# Container Apps
az containerapp list \
  --resource-group "$RESOURCE_GROUP" \
  --output json > "$OUTPUT_DIR/container-apps.json"

# PostgreSQL
az postgres flexible-server list \
  --resource-group "$RESOURCE_GROUP" \
  --output json > "$OUTPUT_DIR/postgres-servers.json"

# ACR
az acr list \
  --resource-group "$RESOURCE_GROUP" \
  --output json > "$OUTPUT_DIR/acr.json"

# Log Analytics
az monitor log-analytics workspace list \
  --resource-group "$RESOURCE_GROUP" \
  --output json > "$OUTPUT_DIR/log-analytics.json"

echo "Diagnostics saved to $OUTPUT_DIR"
```

## Common Investigation Scenarios

### Scenario 1: Application Not Responding

**Steps**:

1. Check Container App health status
2. Verify replica count (check if scaled to zero)
3. Review recent logs
4. Check database connectivity
5. Verify environment variables
6. Check container image tag

**Commands**:

```bash
# Check status
az containerapp show --name <app-name> -g <rg> --query "properties.{runningStatus:runningStatus,healthState:template.healthState,replicas:template.replicas}"

# Get logs
az containerapp logs show --name <app-name> -g <rg> --follow

# Test database
az postgres flexible-server connect --name <db-name> -g <rg>
```

### Scenario 2: Deployment Failures

**Steps**:

1. Check revision provisioning state
2. Review container registry access
3. Verify image exists in ACR
4. Check environment configuration
5. Review revision history

**Commands**:

```bash
# Check revisions
az containerapp revision list --name <app-name> -g <rg>

# Verify image
az acr repository show-tags --name <acr-name> --repository <repo>

# Check ACR credentials
az containerapp show --name <app-name> -g <rg> --query "properties.configuration.registries"
```

### Scenario 3: Performance Issues

**Steps**:

1. Check resource allocation (CPU/memory)
2. Review scaling configuration
3. Query performance metrics
4. Check database performance
5. Review application logs

**Commands**:

```bash
# Get resource allocation
az containerapp show --name <app-name> -g <rg> --query "properties.template.containers[0].resources"

# Get metrics
az monitor metrics list \
  --resource <container-app-id> \
  --metric "Requests,ResponseTime,CpuUsage,MemoryUsage"
```

## Checklist for Complete Diagnostics

- [ ] Subscription and tenant info
- [ ] Resource group details
- [ ] All resources inventory
- [ ] Container Apps configuration (all apps)
- [ ] Container Apps environment settings
- [ ] Database server configuration
- [ ] Database list and schemas
- [ ] Firewall rules
- [ ] Container registry details
- [ ] Repository and image list
- [ ] Log Analytics workspace config
- [ ] Network topology (VNet, subnets, endpoints)
- [ ] Security configuration (identities, secrets)
- [ ] Scaling configuration
- [ ] Current health status
- [ ] Recent deployment history
- [ ] Portal links for quick access
- [ ] Common troubleshooting commands
- [ ] Security recommendations

## Integration with ADD Framework

This diagnostics process integrates with the ADD Framework:

**When to Use**:

- Before making infrastructure changes
- During incident response
- For architecture documentation
- When onboarding new team members

**Documentation Location**:

- Investigation reports: Project root (`INFRA-investigation.md`)
- Architecture decisions: `.add/memory/decisions/`
- Infrastructure sessions: `.add/sessions/active/`

**Session Tracking**:

```markdown
# .add/sessions/active/infrastructure-investigation.md

## Session: Infrastructure Diagnostics

- Date: 2025-12-09
- Agent: Claude Sonnet 4.5
- Goal: Document Azure infrastructure configuration

### Actions Taken

1. Gathered Container Apps configuration
2. Documented PostgreSQL setup
3. Listed ACR repositories
4. Compiled comprehensive report

### Artifacts Created

- INFRA-investigation.md (project root)
- azure-diagnostics.md (this file)

### Recommendations

- Implement Key Vault integration
- Enable VNet for private connectivity
- Configure Azure Monitor alerts
```

## Related Modules

- [.add/memory/modules/api.md](./api.md) - API patterns and conventions
- [.add/memory/modules/database.md](./database.md) - Database schemas and migrations
- [.add/memory/modules/security.md](./security.md) - Security patterns

## External References

- [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/)
- [Azure Container Apps Docs](https://learn.microsoft.com/en-us/azure/container-apps/)
- [PostgreSQL Flexible Server Docs](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/)
- [Azure Container Registry Docs](https://learn.microsoft.com/en-us/azure/container-registry/)

---

**Maintained by**: Development Team
**Review Frequency**: Quarterly or after major infrastructure changes
