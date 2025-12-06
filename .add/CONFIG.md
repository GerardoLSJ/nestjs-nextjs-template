# ADD Framework Configuration

## Framework Settings

### Health Check Mode

**Current Mode**: `strict`

**Available Modes**:

- `strict`: All checks must pass before session end (RECOMMENDED)
- `warn`: Log failures but allow continuation
- `off`: Skip automated checks

### Health Check Rules

When in `strict` mode, the following must pass before ending a session:

1. **Linting**: All projects must pass ESLint checks
2. **Unit Tests**: All unit tests must pass (skipped tests documented)
3. **E2E Tests**: All E2E tests must pass (optional: can be skipped with justification)
4. **Build**: All projects must build successfully (optional: can be deferred)
5. **Type Check**: All TypeScript must compile without errors

### Git Hooks

**Pre-Commit Hooks**: None configured yet

**Pre-Push Hooks**: None configured yet

### Session Protocol

#### Session Start Checklist

1. Read README.md "Current Sprint" section
2. Read .add/SESSION.md for latest state
3. Read .add/MEMORY.md for project context
4. Read .add/TASKS.md for current objectives
5. Check .add/BLOCKERS.md for obstacles
6. Update SESSION.md with new session start entry

#### Session End Checklist

1. Mark completed tasks in TASKS.md
2. Update MEMORY.md with session learnings
3. Run health checks per CONFIG.md (tests, linting, build)
4. Document any architecture decisions in DECISIONS.md
5. Update BLOCKERS.md status
6. Write session summary in SESSION.md
7. Update README.md "Current Sprint" with latest status
8. Commit changes with descriptive message

### Documentation Rules

- All .add/ files are markdown and git-tracked
- README stays lightweight - executive summary only
- ARCHITECTURE.md is the source of truth for design
- Never delete session history in SESSION.md
- MEMORY.md accumulates knowledge, never shrinks
- Update README "Current Sprint" every session end
- DECISIONS.md entries are immutable once made

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:

```
feat(web): implement event planner feature

- Created Event data model with types
- Built useEvents hook with localStorage
- Created EventForm and EventList components
- Added comprehensive tests (96/98 passing)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Project-Specific Settings

### Monorepo Structure

- **Type**: Nx monorepo
- **Package Manager**: npm
- **Node Version**: 18+

### Test Commands

```bash
npm run test:all      # All unit tests
npm run e2e:all       # All E2E tests
npm run lint:all      # All linting
npm run health-check  # Complete health check
```

### Development Commands

```bash
npm run dev:clean     # Clean start (kills ports, removes locks)
npm run dev:all       # Start both API and Web
npm run kill-ports    # Kill processes on 3000 and 3333
npm run clean-locks   # Remove Next.js lock files
```

### Database Commands

```bash
npm run db:up         # Start PostgreSQL
npm run db:down       # Stop PostgreSQL
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```
