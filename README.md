# auth-tutorial

An Nx monorepo featuring a NestJS backend API and Next.js frontend web application with comprehensive testing setup.

## Quick Start

```bash
npm install
npm run dev:all
```

**API**: http://localhost:3333/api | **Web**: http://localhost:3000 | **Docs**: http://localhost:3333/api/docs

## Documentation

Choose based on your role:

- **👤 For Humans**: Read [HUMAN-README.md](HUMAN-README.md) for a concise overview, quick commands, and project status
- **🤖 For Agents**: Read [.add/README.md](.add/README.md) for detailed sprint info, architecture, and co-dev guidance

## Key Commands

```bash
npm run dev:all        # Start API & Web
npm run health-check   # Verify all systems (lint + test + e2e)
npm run test:all       # Run all tests
npm run lint:all       # Lint all projects
```

## Project Structure

```
├── apps/api/          # NestJS API
├── apps/web/          # Next.js frontend
├── apps/api-e2e/      # API E2E tests
├── apps/web-e2e/      # Web E2E tests
├── libs/shared-types/ # Shared types
└── .add/              # Agent documentation
```

## System Status

- **Tests**: 126/127 passing (99%)
- **Build**: ✅ All passing
- **Linting**: ✅ All passing
- **Phase**: 4 (Feature Expansion)
- **Latest Feature**: ✅ Email Verification (2025-12-12)
