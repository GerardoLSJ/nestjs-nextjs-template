# auth-tutorial

An Nx monorepo featuring a NestJS backend API and Next.js frontend web application with comprehensive testing setup.

## Project Overview

This project is an Nx workspace containing:

- **NestJS API** - Backend REST API server
- **Next.js Web App** - Frontend React application
- **Shared Types Library** - TypeScript types shared between API and Web
- **E2E Testing** - End-to-end tests for both API and Web applications

## Project Structure

```
auth-tutorial/
├── apps/
│   ├── api/              # NestJS backend API
│   ├── api-e2e/          # API end-to-end tests (Jest)
│   ├── web/              # Next.js frontend
│   └── web-e2e/          # Web end-to-end tests (Playwright)
├── libs/
│   └── shared-types/     # Shared TypeScript types library
└── packages/             # Additional packages (if needed)
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Start Development Servers

```bash
npm run dev:all
```

This starts both the API server (http://localhost:3333/api) and Web server (http://localhost:3000) concurrently using the `concurrently` package. The API will display colored logs in blue, and the Web app in green.

## Available Commands

### Workspace-Level Commands

| Command                | Description                                                          | Definition                                                                                                         |
| ---------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `npm run dev:all`      | Starts both API (port 3333) and Web (port 3000) servers concurrently | Defined in [`package.json`](package.json) - uses `concurrently` to run `nx serve api` and `nx dev web` in parallel |
| `npm run lint:all`     | Runs ESLint on all projects                                          | Defined in [`package.json`](package.json) - uses Nx `run-many --target=lint`                                       |
| `npm run test:all`     | Runs Jest unit tests on all projects                                 | Defined in [`package.json`](package.json) - uses Nx `run-many --target=test`                                       |
| `npm run e2e:all`      | Runs all E2E tests (Jest for API, Playwright for Web)                | Defined in [`package.json`](package.json) - uses Nx `run-many --target=e2e`                                        |
| `npm run health-check` | Runs lint, test, and e2e sequentially - full system verification     | Defined in [`package.json`](package.json) - chains `lint:all`, `test:all`, `e2e:all`                               |

## Individual Project Commands

These Nx commands allow you to run tasks on specific projects:

| Command                    | Description            | Where Target is Defined                                                        |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| `npx nx serve api`         | Start API server only  | [`apps/api/project.json`](apps/api/project.json) serve target                  |
| `npx nx dev web`           | Start Web server only  | [`apps/web/project.json`](apps/web/project.json) dev target                    |
| `npx nx test api`          | Run API unit tests     | [`apps/api/project.json`](apps/api/project.json) test target                   |
| `npx nx test web`          | Run Web unit tests     | [`apps/web/project.json`](apps/web/project.json) test target                   |
| `npx nx test shared-types` | Run shared-types tests | [`libs/shared-types/project.json`](libs/shared-types/project.json) test target |
| `npx nx lint api`          | Lint API project       | [`apps/api/project.json`](apps/api/project.json) lint target                   |
| `npx nx lint web`          | Lint Web project       | [`apps/web/project.json`](apps/web/project.json) lint target                   |
| `npx nx e2e api-e2e`       | Run API E2E tests      | [`apps/api-e2e/project.json`](apps/api-e2e/project.json) e2e target            |
| `npx nx e2e web-e2e`       | Run Web E2E tests      | [`apps/web-e2e/project.json`](apps/web-e2e/project.json) e2e target            |

### Additional Nx Commands

```bash
# View project dependency graph
npx nx graph

# Run a specific target on all projects
npx nx run-many --target=<target> --all

# Clear Nx cache
npx nx reset
```

## For LLM Agents

### Health Check

To verify the entire system is working correctly:

```bash
npm run health-check
```

**Expected Outcome:** Exit code 0 indicates all linting, unit tests, and E2E tests passed successfully.

### Quick Start

```bash
npm install
npm run dev:all
```

The API will be available at http://localhost:3333/api, with interactive API documentation at http://localhost:3333/api/docs (Swagger UI). The Web app will be available at http://localhost:3000.

## Server URLs

- **API Server:** http://localhost:3333/api
- **API Documentation:** http://localhost:3333/api/docs (Swagger UI)
- **Web Application:** http://localhost:3000

## Configuration Files

Key configuration files in this workspace:

- [`nx.json`](nx.json) - Nx workspace configuration
- [`package.json`](package.json) - npm scripts and dependencies
- [`tsconfig.base.json`](tsconfig.base.json) - Base TypeScript configuration
- [`eslint.config.mjs`](eslint.config.mjs) - ESLint configuration
- [`jest.preset.js`](jest.preset.js) - Jest preset configuration

### Project-Specific Configurations

- **API:** [`apps/api/project.json`](apps/api/project.json)
- **Web:** [`apps/web/project.json`](apps/web/project.json), [`apps/web/next.config.js`](apps/web/next.config.js)
- **API E2E:** [`apps/api-e2e/jest.config.ts`](apps/api-e2e/jest.config.ts)
- **Web E2E:** [`apps/web-e2e/playwright.config.ts`](apps/web-e2e/playwright.config.ts)
- **Shared Types:** [`libs/shared-types/project.json`](libs/shared-types/project.json)

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test:all

# Run tests for specific project
npx nx test api
npx nx test web
npx nx test shared-types
```

### E2E Tests

```bash
# Run all E2E tests
npm run e2e:all

# Run specific E2E tests
npx nx e2e api-e2e
npx nx e2e web-e2e
```

## Linting

```bash
# Lint all projects
npm run lint:all

# Lint specific project
npx nx lint api
npx nx lint web
```

## Troubleshooting

### Common Issues and Solutions

#### Missing `reflect-metadata` Import

**Issue:** NestJS decorators not working properly or reflection errors.

**Solution:** Ensure `reflect-metadata` is imported at the very top of [`apps/api/src/main.ts`](apps/api/src/main.ts):

```typescript
import 'reflect-metadata';
```

#### Webpack Output Path Configuration

**Issue:** Build artifacts not generated in the correct location for NX monorepos.

**Solution:** Configure the output path in [`apps/api/webpack.config.js`](apps/api/webpack.config.js):

```javascript
output: {
  path: path.join(__dirname, '../../dist/apps/api'),
}
```

#### Incorrect Executor for Node.js Apps

**Issue:** Using `@nx/webpack:dev-server` instead of the correct Node.js executor.

**Solution:** Use `@nx/js:node` executor in [`apps/api/project.json`](apps/api/project.json) for Node.js applications:

```json
"serve": {
  "executor": "@nx/js:node",
  "options": {
    "buildTarget": "api:build",
    "watch": true
  }
}
```

#### Windows Compatibility for Parallel Scripts

**Issue:** Using `&` or `&&` for running parallel commands doesn't work reliably on Windows.

**Solution:** Use the `concurrently` package instead:

```json
"dev:all": "concurrently --names \"API,WEB\" -c \"bgBlue.bold,bgGreen.bold\" \"npx nx run api:serve\" \"npx nx run web:dev\""
```

## Learn More

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright Documentation](https://playwright.dev)

## Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog)
