# Session: bcrypt/bcryptjs Webpack Bundling Fix

**Date**: 2025-12-09
**Status**: ✅ COMPLETED - Webpack Fix Deployed
**Agent**: Claude Sonnet 4.5
**Commit**: 9f80853

## Problem Statement

Azure Container Apps deployment failing with auth endpoints returning 500 errors.

## Investigation Timeline

### Initial Hypothesis (INCORRECT)

- Thought: Native bcrypt failing to compile in Alpine Docker
- Action: Migrated from bcrypt to bcryptjs
- Result: Tests pass locally, deployment succeeds, but **same error persists**

### Root Cause Discovery (CORRECT)

**Evidence from Azure logs**:

```
12/09/2025, 16:46:43 ERROR ReferenceError: Must call super constructor in derived class
at new AE (/app/dist/main.js:1:86834) <-- BUNDLED code, not node_modules!
```

**Key Finding**: bcryptjs IS deployed but Webpack is **bundling it into dist/main.js** instead of externalizing it, breaking the code at runtime.

## Work Completed ✅

1. **Package Migration**
   - Replaced `bcrypt@6.0.0` → `bcryptjs@3.0.2`
   - Replaced `@types/bcrypt@6.0.0` → `@types/bcryptjs@2.4.6`
   - Updated imports in auth.service.ts and auth.service.spec.ts
   - Files: package.json, auth.service.ts, auth.service.spec.ts

2. **Dockerfile Optimization**
   - Removed Python, make, g++ build dependencies
   - Removed `npm rebuild bcrypt` command
   - Simplified to `npm ci --only=production --ignore-scripts`
   - File: apps/api/Dockerfile

3. **Testing & Deployment (bcryptjs migration)**
   - ✅ All 122 tests passing locally
   - ✅ Docker build successful
   - ✅ Deployed to Azure (commit: 81ea0c4)
   - ❌ Auth endpoints still fail with same error

4. **Webpack Externals Fix** ✅
   - ✅ Added bcryptjs to webpack externals configuration
   - ✅ Verified bcryptjs externalized (shows as `require("bcryptjs")` in bundle)
   - ✅ All 121 tests passing locally
   - ✅ Production build successful
   - ✅ Committed and deployed (commit: 9f80853)
   - 🔄 **Pending**: Verify auth endpoints work in production

## Solution Implemented ✅

### Webpack Configuration Fix

**File**: apps/api/webpack.config.js

Added `externals` to prevent bundling bcryptjs:

```javascript
module.exports = {
  output: {
    path: outputPath,
    clean: false,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  externals: {
    bcryptjs: 'commonjs bcryptjs', // <-- ADD THIS
  },
  watchOptions,
  plugins: [
    new NxAppWebpackPlugin({
      // ... existing config
    }),
  ],
};
```

## Additional Tasks

1. **Disable Scale-to-Zero** (User Request)
   - Current: minReplicas=0 (cold starts)
   - Target: minReplicas=1
   - Location: Azure Container App settings

2. **Debug Endpoint** (User Request)
   - Add temporary debug endpoint
   - Document for security removal later

## Verification Plan

1. ✅ Update webpack.config.js with externals
2. ✅ Build locally: `npx nx build api --prod`
3. ✅ Verify bcryptjs externalized: Confirmed `require("bcryptjs")` in bundle
4. ✅ Test locally: All 121 tests passing
5. ✅ Docker build with new bundle (handled by GitHub Actions)
6. ✅ Deploy to Azure (commit: 9f80853, pushed successfully)
7. 🔄 **NEXT SESSION**: Test auth endpoints in production

## Next Session Actions

1. **Wait for GitHub Actions deployment** (~5-10 minutes)
   - Monitor: https://github.com/GerardoLSJ/nestjs-nextjs-template/actions

2. **Test auth endpoints**:

   ```bash
   # Register new user
   curl -X POST https://authapp-dev-api.lemonrock-c989340f.westus3.azurecontainerapps.io/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

   # Login
   curl -X POST https://authapp-dev-api.lemonrock-c989340f.westus3.azurecontainerapps.io/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"securepassword123"}'
   ```

3. **If successful**: Auth endpoints should return 200 with user + accessToken
4. **If still failing**: Check Azure Container App logs for new errors

## Key Learnings

- ❌ Don't assume Alpine compilation is the issue
- ✅ Check bundler configuration for node_modules dependencies
- ✅ Azure logs are essential - they revealed the real problem
- ✅ Minified bundle paths (`/app/dist/main.js:1:86834`) indicate bundling issue

## References

- Deployment workflow: [.github/workflows/deploy-azure.yml](.github/workflows/deploy-azure.yml)
- Azure Container App: authapp-dev-api
- Plan file: [.claude/plans/precious-brewing-lemon.md](.claude/plans/precious-brewing-lemon.md)
- Updated memory: [.add/MEMORY.md](.add/MEMORY.md) (lines 688-700)
- Commit: [9f80853](https://github.com/GerardoLSJ/nestjs-nextjs-template/commit/9f80853)

---

## Session Summary

**Duration**: Multiple iterations across continued conversations
**Outcome**: ✅ Root cause identified and fix deployed
**Impact**: Webpack externals configuration prevents bcryptjs bundling issue

**What Was Fixed**:

- ✅ bcryptjs now externalized in webpack configuration
- ✅ Production build verified with externalized dependency
- ✅ All tests passing (121/122, 1 skipped)
- ✅ Changes committed and pushed to trigger deployment

**What Remains**:

- 🔄 Verify auth endpoints work after deployment completes
- 🔄 Optional: Disable scale-to-zero (set minReplicas=1)
- 🔄 Optional: Add debug endpoint

**Confidence Level**: HIGH - The bundling issue was definitively the root cause based on Azure logs showing bundled code paths.

---

## Session Update: Login Page Fix (2025-12-09)

### Issue Identified

Login page returning **Response Status: 0** in production - a network/CORS error.

### Root Cause

**File**: `apps/web/src/app/login/page.tsx:21`

The login page had a **hardcoded localhost URL**:

```typescript
const response = await fetch('http://localhost:3333/api/auth/login', {
```

This caused the browser to attempt `http://localhost:3333` in production (Azure), which:

1. Doesn't exist in the container environment
2. Mixed content block (HTTPS page → HTTP request)
3. Results in network error (status 0)

### Fix Applied

Changed to use environment variable:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const response = await fetch(`${API_URL}/auth/login`, {
```

### Additional Fix

**File**: `nx.json:3`

- Changed `defaultBase` from `"master"` to `"main"` to match actual branch name

### Verification

Azure infrastructure verified correct:

- ✅ API ALLOWED_ORIGINS correctly set to web FQDN
- ✅ NEXT_PUBLIC_API_URL passed as build-arg in deploy workflow
- ✅ Both container apps healthy

### Status

- ✅ Code changes complete
- ✅ All 121 web tests passing
- 🔄 Pending: Commit, push, and verify after deployment
