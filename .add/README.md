# ADD Framework 2.0 - Memory System

> **Version**: 2.0.0 | **Structure**: Hierarchical | **Target**: Haiku/Sonnet/Opus

This is the ADD (Agent-Driven Development) Framework 2.0 memory system for structured, context-aware development.

## 🚀 Quick Start

### For Any Development Task

Use the ADD Framework bootloader to load the right context automatically:

```bash
@entry-point <command> <args>
```

**Available Commands:**

- `@entry-point develop-feature <name>` - Create/continue feature development
- `@entry-point fix-bug <issue>` - Debug and fix an issue
- `@entry-point continue` - Resume your last active session
- `@entry-point status` - Quick overview of current state

### Example

```bash
@entry-point develop-feature event-filtering
```

What happens:

1. Loads core context (~1.4K tokens)
2. Matches "event" → loads `memory/modules/events.md`
3. Matches "filtering" → loads `memory/modules/database.md`
4. Creates session: `.add/sessions/active/event-filtering.md`
5. Ready to start with right context loaded!

---

## 📁 Structure

```
.add/
├── BOOTLOADER.md              # Entry point (start here!)
├── README.md                  # This file
├── manifest.json              # Context routing & triggers
│
├── core/                       # Always-loaded context (~1.4K tokens)
│   ├── project.md            # Tech stack & conventions
│   └── agents.md             # Model protocols & roles
│
├── memory/
│   ├── modules/              # Domain-specific knowledge
│   │   ├── auth.md           # Authentication patterns
│   │   ├── database.md       # Prisma & database
│   │   ├── api.md            # NestJS & REST patterns
│   │   ├── frontend.md       # React & Next.js
│   │   ├── testing.md        # Jest, E2E, MSW patterns
│   │   ├── events.md         # Event planner feature
│   │   ├── security.md       # Helmet, rate limiting, CORS
│   │   └── error-handling.md # Error patterns & filters
│   │
│   └── decisions/            # Architecture Decision Records
│       └── DECISIONS.md
│
├── sessions/                  # Task tracking
│   ├── active/               # Currently active session
│   └── archive/              # Completed sessions
│
├── prompts/                   # Entry point templates
│   └── entry-points/         # Command-specific prompts
│
└── handoffs/                  # Cross-model delegation (future)
```

---

## 🧠 How It Works

### Context Budget Strategy

Your token budget depends on the model:

| Model      | Budget | Response Reserve | Recommended       |
| ---------- | ------ | ---------------- | ----------------- |
| Haiku 4.5  | 200K   | 8K               | 8-12K for memory  |
| Sonnet 4.5 | 200K   | 16K              | 16-24K for memory |
| Opus 4.5   | 200K   | 32K              | 32-48K for memory |

### Loading Priority

1. **Critical** (always): `BOOTLOADER.md`, `manifest.json`, `core/project.md` (~1.4K)
2. **Task-specific** (by command/triggers): relevant modules + session (~3-4K)
3. **On-demand** (if referenced): additional docs, decisions (~1-2K)

### Trigger Matching

When you use `@entry-point develop-feature user-auth`, the bootloader:

1. Parses keywords: "user", "auth"
2. Checks `manifest.json` for triggers
3. Matches against: `auth.md` (triggers: "auth", "user", "login", etc.)
4. Loads that module + core context
5. Total context: ~4.1K tokens ✅

---

## 📖 Documentation by Domain

### For Authentication/Authorization Work

→ Read: [memory/modules/auth.md](memory/modules/auth.md)

**Topics**: JWT, Passport.js, guards, token refresh, user management

### For Database/ORM Work

→ Read: [memory/modules/database.md](memory/modules/database.md)

**Topics**: Prisma, PostgreSQL, migrations, schema design, relationships

### For API/REST Endpoints

→ Read: [memory/modules/api.md](memory/modules/api.md)

**Topics**: NestJS controllers, DTOs, validation, OpenAPI/Swagger

### For Frontend/React/Next.js

→ Read: [memory/modules/frontend.md](memory/modules/frontend.md)

**Topics**: React components, hooks, Next.js App Router, CSS Modules

### For Testing

→ Read: [memory/modules/testing.md](memory/modules/testing.md)

**Topics**: Jest, Supertest, Playwright, MSW mocking, test fixtures

### For Event Planner Feature

→ Read: [memory/modules/events.md](memory/modules/events.md)

**Topics**: Event CRUD, calendar picker, ownership validation

### For Security

→ Read: [memory/modules/security.md](memory/modules/security.md)

**Topics**: Helmet.js, rate limiting, CORS, security headers

### For Error Handling

→ Read: [memory/modules/error-handling.md](memory/modules/error-handling.md)

**Topics**: Global filters, error boundaries, correlation IDs, logging

---

## 🎯 Project Status

### Current Phase

**Phase 3.4: Documentation & Deployment Prep** (IN PROGRESS)

**Tests**: 126/127 passing (99% pass rate)

### Completed Phases

- ✅ **3.1** - Error Handling Strategy
- ✅ **3.2** - Security Hardening
- ✅ **3.3** - Comprehensive Test Suite
- ✅ **Phase 2** - Contract Generation (OpenAPI/Orval)
- ✅ **Phase 1** - Core Architecture

### Next Up

- **Phase 4** - Feature Expansion (Event editing, filtering)

---

## 🔗 Quick Navigation

| Need                 | File                                                                       | Purpose                          |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| **Tech Stack**       | [core/project.md](core/project.md)                                         | Always-loaded project context    |
| **Model Protocols**  | [core/agents.md](core/agents.md)                                           | How different models collaborate |
| **Context Triggers** | [manifest.json](manifest.json)                                             | How commands route to context    |
| **Boot Sequence**    | [BOOTLOADER.md](BOOTLOADER.md)                                             | How @entry-point works           |
| **Decisions**        | [memory/decisions/DECISIONS.md](memory/decisions/DECISIONS.md)             | Architecture decision records    |
| **Sessions**         | [sessions/active/](sessions/active/)                                       | Your current work                |
| **History**          | [sessions/archive/SESSION_HISTORY.md](sessions/archive/SESSION_HISTORY.md) | Past session learnings           |

---

## 💡 Best Practices

1. **Always use @entry-point** - Ensures correct context loading automatically
2. **Keep sessions updated** - Update `.add/sessions/active/*.md` during work
3. **Document patterns** - Add learnings to relevant module files
4. **Create ADRs** - For architectural decisions: `memory/decisions/DECISIONS.md`
5. **Test context loading** - Verify `@entry-point status` works after changes

---

## 🛠️ Manual Context Loading (Alternative)

If not using `@entry-point`, follow this sequence:

### Step 1: Always Load

```markdown
1. .add/BOOTLOADER.md - Understand the boot protocol
2. .add/manifest.json - See available context segments
3. .add/core/project.md - Get tech stack & conventions
```

### Step 2: Load by Domain

Pick relevant modules for your task:

```markdown
- Authentication → memory/modules/auth.md
- Database/Prisma → memory/modules/database.md
- API/REST/NestJS → memory/modules/api.md
- Frontend/React → memory/modules/frontend.md
- Testing → memory/modules/testing.md
- Events Feature → memory/modules/events.md
- Security → memory/modules/security.md
- Error Handling → memory/modules/error-handling.md
```

### Step 3: Check History

```markdown
- Decisions → memory/decisions/DECISIONS.md
- Past Sessions → sessions/archive/SESSION_HISTORY.md
- Active Session → sessions/active/\*.md
```

---

## 🚨 Troubleshooting

### `@entry-point` not working?

1. Check [BOOTLOADER.md](BOOTLOADER.md) for boot sequence
2. Verify [manifest.json](manifest.json) has your triggers
3. Make sure session files exist in `sessions/active/`

### Missing context?

1. Check [manifest.json](manifest.json) for segment triggers
2. Verify module files exist in `memory/modules/`
3. Review `core/project.md` for always-loaded content

### Context not matching?

1. Review trigger keywords in [manifest.json](manifest.json)
2. Check module files for relevant patterns
3. See [sessions/archive/SESSION_HISTORY.md](sessions/archive/SESSION_HISTORY.md) for examples

---

## 📚 Resources

- **Bootloader Guide**: [BOOTLOADER.md](BOOTLOADER.md)
- **Manifest Reference**: [manifest.json](manifest.json)
- **Project Tech Stack**: [core/project.md](core/project.md)
- **Agent Protocols**: [core/agents.md](core/agents.md)

---

## 📝 Version History

| Version | Date       | Changes                                  |
| ------- | ---------- | ---------------------------------------- |
| 2.0.0   | 2025-12-07 | Initial ADD Framework 2.0 implementation |

---

_ADD Framework 2.0 - Hierarchical Memory System for Agent-Driven Development_
