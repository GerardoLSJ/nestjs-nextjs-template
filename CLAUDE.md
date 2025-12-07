# Claude Code Instructions

## ADD Framework Entry Point

This project uses the ADD (Agent-Driven Development) Framework 2.0 for structured memory and context management.

### For Any Development Task

Before starting work, use the ADD Framework bootloader:

```
@entry-point <command> <args>
```

### Available Commands

- `@entry-point develop-feature <name>` - Feature development
- `@entry-point fix-bug <issue>` - Bug fixing
- `@entry-point continue` - Resume last session
- `@entry-point status` - Quick overview

### Boot Protocol

Before ANY work:

1. Read [.add/BOOTLOADER.md](.add/BOOTLOADER.md)
2. Read [.add/manifest.json](.add/manifest.json)
3. Load context segments based on command
4. Create/resume session in `.add/sessions/active/`
5. Update session after each significant change

### How It Works

The bootloader will:
1. Load core context (always): `core/project.md`, `core/agents.md`
2. Match keywords against segment triggers to load relevant modules
3. Stay within token budget for your model (Haiku: 8K, Sonnet: 16K, Opus: 32K)
4. Create/resume session file for tracking progress

### Example

```
@entry-point develop-feature user-preferences
```

**What happens**:
- Loads core context (~1.4K tokens)
- Matches "user" → loads `memory/modules/auth.md` (~1.5K tokens)
- Matches "preferences" → loads `memory/modules/database.md` (~1.2K tokens)
- Creates session file: `.add/sessions/active/user-preferences.md`
- Total: ~4.1K tokens loaded

### Manual Context Loading (Alternative)

If not using `@entry-point`, follow this sequence:

1. **Always read first**:
   - [.add/core/project.md](.add/core/project.md) - Tech stack & conventions
   - [.add/README.md](.add/README.md) - Current sprint & status

2. **For specific domains, read**:
   - [.add/memory/modules/auth.md](.add/memory/modules/auth.md) - Authentication patterns
   - [.add/memory/modules/database.md](.add/memory/modules/database.md) - Prisma & database
   - [.add/memory/modules/api.md](.add/memory/modules/api.md) - NestJS API patterns
   - [.add/memory/modules/frontend.md](.add/memory/modules/frontend.md) - React & Next.js
   - [.add/memory/modules/testing.md](.add/memory/modules/testing.md) - Test patterns
   - [.add/memory/modules/events.md](.add/memory/modules/events.md) - Event planner feature
   - [.add/memory/modules/security.md](.add/memory/modules/security.md) - Security headers & rate limiting
   - [.add/memory/modules/error-handling.md](.add/memory/modules/error-handling.md) - Error patterns

3. **For decisions & history**:
   - [.add/memory/decisions/DECISIONS.md](.add/memory/decisions/DECISIONS.md) - Architecture decisions
   - [.add/sessions/archive/SESSION_HISTORY.md](.add/sessions/archive/SESSION_HISTORY.md) - Historical sessions

## Project Quick Reference

### Tech Stack

- **Monorepo**: Nx workspace
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14+ (App Router) + React
- **Testing**: Jest + Supertest + Playwright + MSW
- **Security**: Helmet.js + Rate limiting + CORS
- **Contract**: OpenAPI/Swagger + Orval

### Quick Commands

```bash
npm run dev:clean       # Clean start (recommended)
npm run test:all        # All unit tests
npm run e2e:all         # All E2E tests
npm run health-check    # Full verification
npm run api:generate    # Generate OpenAPI client
```

### Current Status

- **Phase**: 3.4 - Documentation & Deployment Prep
- **Tests**: 126/127 passing (99%)
- **Sprint**: Phase 3 - Polish & Production

See [.add/core/project.md](.add/core/project.md) for full details.

## Framework Structure

```
.add/
├── BOOTLOADER.md          # Entry point (start here!)
├── manifest.json          # Context routing
├── core/
│   ├── project.md         # Always loaded (~1000 tokens)
│   └── agents.md          # Model protocols (~400 tokens)
├── memory/
│   ├── modules/           # Domain-specific knowledge
│   │   ├── auth.md
│   │   ├── database.md
│   │   ├── api.md
│   │   ├── frontend.md
│   │   ├── testing.md
│   │   ├── events.md
│   │   ├── security.md
│   │   └── error-handling.md
│   └── decisions/         # ADRs
├── sessions/
│   ├── active/            # Current work
│   └── archive/           # Historical sessions
├── handoffs/              # Cross-model delegation
└── prompts/
    └── entry-points/      # Command templates
```

## Best Practices

1. **Use the bootloader** - `@entry-point` ensures correct context loading
2. **Update sessions** - Keep session files current during work
3. **Add learnings** - Update module files with new patterns
4. **Document decisions** - Create ADRs for architectural choices
5. **Run health checks** - Before committing: `npm run health-check`

## Getting Help

- Boot sequence not working? Check [.add/BOOTLOADER.md](.add/BOOTLOADER.md)
- Missing context? Check [.add/manifest.json](.add/manifest.json) triggers
- Need patterns? Check module files in [.add/memory/modules/](.add/memory/modules/)
- Historical info? Check [.add/sessions/archive/](.add/sessions/archive/)

---

*For more details, see [.add/BOOTLOADER.md](.add/BOOTLOADER.md)*
