# System Check-up Plan

This document outlines the procedures for verifying the health and functionality of the `auth-tutorial` system.

## Quick Health Check (For LLM Agents)

For a comprehensive health check of the entire system, run:

```bash
npm run health-check
```

**What it does:**

- Runs linting on all projects (`lint:all`)
- Runs unit tests on all projects (`test:all`)
- Runs e2e tests on all projects (`e2e:all`)

**Expected outcome when healthy:**
All commands should exit with code 0, indicating:

- No linting errors across api, web, and shared-types
- All unit tests pass
- All e2e tests pass

**Individual commands available:**
If you need to run checks separately:

- `npm run lint:all` - Run linting only
- `npm run test:all` - Run unit tests only
- `npm run e2e:all` - Run e2e tests only

**Note:** E2E tests may require running servers. The health-check command runs them sequentially, so ensure any necessary services are available or use individual commands for targeted testing.

## 1. Automated Verification

Execute the following commands to run automated tests and checks.

### Unit Tests

Run unit tests for individual applications:

```bash
npx nx test api
npx nx test web
npx nx test shared-types
```

### Linting

Verify code quality and standards:

```bash
npx nx lint api
npx nx lint web
npx nx lint shared-types
```

### End-to-End (E2E) Tests

Run full system tests (ensure environment is ready if needed, though usually Nx handles setup):

```bash
npx nx e2e api-e2e
npx nx e2e web-e2e
```

## 2. Startup Procedure

To start the applications for manual testing or development, use the following commands. It is recommended to run these in separate terminal windows.

### Start Backend (API)

This will start the NestJS API server on port 3333.

```bash
npx nx serve api
```

### Start Frontend (Web)

This will start the Next.js web application on port 3000.

```bash
npx nx dev web
```

## 3. Manual / Health Verification

Once the applications are running, use the following methods to verify they are live and responsive.

### API Health Check

Confirm the API is responding:

- **URL:** `http://localhost:3333/api`
- **Command:** `curl http://localhost:3333/api`
- **Expected Response:** A JSON object or message confirming the API is running (e.g., `{"message":"Hello API"}`).

### Web Application Check

Confirm the frontend is accessible:

- **URL:** `http://localhost:3000`
- **Action:** Open the URL in a web browser.
- **Expected Result:** The landing page of the Auth Tutorial application should load without errors.
