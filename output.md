# ADD Framework: Agent-Driven Development

## Self-Contained Framework for AI Agent Memory & Task Management

> A structured documentation system that enables AI agents to maintain context across sessions, manage tasks effectively, and ensure quality through automated health checks.

**Version:** 1.0
**Language:** Agnostic (works with JavaScript, TypeScript, C#, Python, Java, Go, etc.)
**License:** MIT
**Author:** Luis Gerardo Lopez (gerardolsj)

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Quick Start](#quick-start)
3. [Framework Structure](#framework-structure)
4. [File Specifications](#file-specifications)
5. [Session Protocols](#session-protocols)
6. [Health Check System](#health-check-system)
7. [Language-Specific Adaptations](#language-specific-adaptations)
8. [Best Practices](#best-practices)
9. [Templates](#templates)

---

## Philosophy

### Core Principles

1. **Three Documentation Layers**

   - **README.md** - Executive Dashboard (lightweight, current status)
   - **ARCHITECTURE.md** - Human Reference (design, patterns, decisions)
   - **.add/ Directory** - Agent Memory System (8 structured files)

2. **Persistent Memory**

   - Session history is never deleted
   - Knowledge accumulates, never shrinks
   - Decisions are immutable once made
   - Context restoration across sessions

3. **Quality Gates**

   - Automated health checks before session end
   - Configurable strictness levels
   - Test results tracked over time
   - Regressions caught early

4. **Structured Task Management**
   - Clear task breakdown and prioritization
   - Blockers documented immediately
   - Side tasks tracked separately
   - Progress visible to all stakeholders

---

## Quick Start

### 1. Create Framework Structure

```bash
# Create .add directory
mkdir .add

# Create 8 framework files
touch .add/CONFIG.md
touch .add/SESSION.md
touch .add/MEMORY.md
touch .add/TASKS.md
touch .add/BLOCKERS.md
touch .add/DECISIONS.md
touch .add/HEALTH_CHECKS.md
touch .add/SIDE_TASKS.md
```

### 2. Initialize Files

Copy the templates from the [Templates](#templates) section below into each file.

### 3. Update README.md

Add a "Current Sprint" section at the top of your README:

```markdown
# Your Project Name

## Current Sprint

**Status**: 🔄 IN PROGRESS
**Focus**: [Current focus area]

**Quick Stats**:

- Tests: ✅ X/Y passing
- Build: ✅ Passing
- Linting: ✅ Clean

**Recent Accomplishments**:

- ✅ [Accomplishment 1]
- ✅ [Accomplishment 2]

**Next Steps**:

- [ ] [Next task 1]
- [ ] [Next task 2]

**Quick Links**: [CONFIG](.add/CONFIG.md) | [SESSION](.add/SESSION.md) | [MEMORY](.add/MEMORY.md) | [TASKS](.add/TASKS.md) | [BLOCKERS](.add/BLOCKERS.md) | [DECISIONS](.add/DECISIONS.md)

---
```

### 4. Configure Your Project

Edit `.add/CONFIG.md` and customize:

- Health check mode (strict/warn/off)
- Test commands for your language/framework
- Build commands
- Project-specific settings

---

## Framework Structure

### Directory Layout

```
your-project/
├── .add/                    # Agent memory system (git-tracked)
│   ├── CONFIG.md           # Framework settings & protocols
│   ├── SESSION.md          # Session history log
│   ├── MEMORY.md           # Persistent learnings & patterns
│   ├── TASKS.md            # Current & future work
│   ├── BLOCKERS.md         # Obstacles & resolutions
│   ├── DECISIONS.md        # Architecture Decision Records
│   ├── HEALTH_CHECKS.md    # Quality gates & benchmarks
│   └── SIDE_TASKS.md       # Parallel work & nice-to-haves
├── README.md               # Executive dashboard
└── ARCHITECTURE.md         # Human reference docs
```

### File Purposes

| File                 | Purpose                            | Changes             |
| -------------------- | ---------------------------------- | ------------------- |
| **CONFIG.md**        | Framework configuration, protocols | Infrequent          |
| **SESSION.md**       | Session log (append-only)          | Every session       |
| **MEMORY.md**        | Accumulated knowledge              | Grows over time     |
| **TASKS.md**         | Active work items                  | Frequent            |
| **BLOCKERS.md**      | Current obstacles                  | As needed           |
| **DECISIONS.md**     | ADRs (append-only)                 | When decisions made |
| **HEALTH_CHECKS.md** | Test results, benchmarks           | Every session       |
| **SIDE_TASKS.md**    | Nice-to-have items                 | Occasional          |

---

## File Specifications

### 1. CONFIG.md - Framework Configuration

**Purpose**: Central configuration for framework behavior

**Contents**:

- Health check mode (strict/warn/off)
- Session start/end checklists
- Documentation rules
- Project-specific commands
- Git commit format

**Example Structure**:

````markdown
# ADD Framework Configuration

## Framework Settings

### Health Check Mode

**Current Mode**: `strict`

**Available Modes**:

- `strict`: All checks must pass before session end (RECOMMENDED)
- `warn`: Log failures but allow continuation
- `off`: Skip automated checks

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
3. Run health checks per CONFIG.md
4. Document any architecture decisions in DECISIONS.md
5. Update BLOCKERS.md status
6. Write session summary in SESSION.md
7. Update README.md "Current Sprint"
8. Commit changes with descriptive message

### Documentation Rules

- All .add/ files are markdown and git-tracked
- README stays lightweight - executive summary only
- ARCHITECTURE.md is the source of truth for design
- Never delete session history in SESSION.md
- MEMORY.md accumulates knowledge, never shrinks
- Update README "Current Sprint" every session end
- DECISIONS.md entries are immutable once made

## Project-Specific Settings

### Test Commands

```bash
# Add your test commands here
npm test              # Unit tests
npm run test:e2e      # Integration tests
npm run test:all      # All tests
```
````

### Build Commands

```bash
# Add your build commands here
npm run build         # Production build
npm run lint          # Code linting
```

````

---

### 2. SESSION.md - Session History

**Purpose**: Chronological log of all development sessions

**Rules**:
- Append-only (never delete history)
- One entry per session
- Include date, status, objectives, accomplishments, learnings

**Example Structure**:

```markdown
# Session Log

## Current Session

**Session Number**: X
**Date**: YYYY-MM-DD
**Status**: [🔄 IN PROGRESS | ✅ COMPLETE]
**Focus**: [Main focus area]

### Session Objectives
- [ ] Objective 1
- [ ] Objective 2

### Session Notes
- **Feature X** ✅:
  - Implementation details
  - Test results
  - Key decisions

### Key Learnings
1. Learning 1
2. Learning 2

---

## Session X-1 - YYYY-MM-DD

**Status**: ✅ COMPLETE
**Focus**: [Previous session focus]

### Accomplishments
- ✅ Accomplishment 1
- ✅ Accomplishment 2

### Technical Details
[Detailed notes]

### Key Learnings
1. Learning from previous session
````

---

### 3. MEMORY.md - Persistent Knowledge

**Purpose**: Accumulated learnings, patterns, gotchas (never shrinks)

**Contents**:

- Patterns & best practices
- Common gotchas
- Technology-specific knowledge
- Performance considerations
- Security patterns
- Common commands

**Example Structure**:

````markdown
# Project Memory

> Persistent learnings, patterns, and gotchas. This document accumulates knowledge and never shrinks.

## Patterns & Best Practices

### [Pattern Name]

**Pattern Structure**:

```[language]
// Code example
```
````

**Key Points**:

- Point 1
- Point 2

## Common Gotchas

### [Gotcha Name]

**Problem**: [Description]

**Solution**: [How to solve it]

```[language]
// Solution code
```

## Technology-Specific Knowledge

### [Technology/Framework]

**Best Practice 1**:
[Description and example]

## Common Commands

### [Category]

```bash
command1  # Description
command2  # Description
```

````

---

### 4. TASKS.md - Task Management

**Purpose**: Track current sprint, active tasks, future work, and backlog

**Contents**:
- Current sprint goal
- Active tasks with subtasks
- Future work (pending phases)
- Backlog (ideas and enhancements)
- Completed tasks log

**Example Structure**:

```markdown
# Active Tasks

## Current Sprint

**Sprint Goal**: [Goal description]
**Status**: [🔄 IN PROGRESS | ✅ COMPLETE | ⏳ PENDING]

### Active Tasks

#### 1. [Task Name] [Status Icon]

**Status**: [in_progress | pending | blocked]
**Priority**: [HIGH | MEDIUM | LOW]
**Assignee**: Agent

**Subtasks**:
- [x] Completed subtask
- [ ] Pending subtask

**Next Steps**:
1. Step 1
2. Step 2

---

## Future Work

### [Phase/Feature Name]

**Status**: ⏳ PENDING
**Prerequisites**: [List]

**Tasks**:
- [ ] Task 1
- [ ] Task 2

---

## Backlog

### [Enhancement Name]

**Status**: 💡 IDEA
**Priority**: [HIGH | MEDIUM | LOW]
**Effort**: ~X hours

**Description**: [What to build]

**Tasks**:
- [ ] Task 1

---

## Completed Tasks

### ✅ [Task Name] (Session X)

**Completed**: YYYY-MM-DD
**Effort**: X hours

**What was delivered**:
- Item 1
- Item 2

**Outcomes**:
- Outcome 1
````

---

### 5. BLOCKERS.md - Obstacles & Resolutions

**Purpose**: Track current blockers, attempted solutions, and resolutions

**Contents**:

- Active blockers
- Resolved blockers (with solutions)
- Potential future blockers
- Mitigation strategies

**Example Structure**:

```markdown
# Blockers & Obstacles

> Current obstacles and mitigation plans. Update immediately when blockers are encountered.

## Active Blockers

### 🚫 [Blocker Name]

**Blocked**: [What is blocked?]
**Date Identified**: YYYY-MM-DD
**Impact**: [Severity description]

**Problem**:

- Issue description
- Error messages

**Attempted Solutions**:

1. Solution 1 ❌ Failed
2. Solution 2 🔄 In progress

**Mitigation Plan**:

- Step 1
- Step 2

---

## Resolved Blockers

### ✅ [Resolved Blocker]

**Blocked**: [What was blocked]
**Date Identified**: YYYY-MM-DD
**Date Resolved**: YYYY-MM-DD

**Problem**: [Description]

**Resolution**: [How it was fixed]

**Lessons Learned**:

- Lesson 1
- Lesson 2

---

## Potential Future Blockers

### ⚠️ [Potential Issue]

**Risk Level**: [HIGH | MEDIUM | LOW]
**Probability**: X%

**Potential Issue**: [Description]

**Mitigation Strategy**:

1. Prevention step 1
2. Prevention step 2
```

---

### 6. DECISIONS.md - Architecture Decision Records

**Purpose**: Immutable log of architectural decisions

**Contents**:

- ADR entries (append-only)
- Decision context, rationale, alternatives
- Implementation details
- Impact assessment

**Example Structure**:

```markdown
# Architecture Decision Records (ADRs)

> Immutable log of architectural decisions. Each entry documents a decision, its context, and rationale.

## Decision Log

### ADR-XXX: [Decision Title] (YYYY-MM-DD)

**Status**: [🔄 PROPOSED | ✅ ACCEPTED | ❌ REJECTED | ⚠️ DEPRECATED]

**Context**:

- What is the issue we're facing?
- What constraints exist?
- What are the requirements?

**Decision**: [What are we deciding to do?]

**Rationale**:

- Why this decision?
- What are the benefits?
- What problems does it solve?

**Alternatives Considered**:

- Alternative 1 (rejected: reason)
- Alternative 2 (rejected: reason)

**Implementation**:

- How will we implement this?
- Key code examples or configuration

**Impact**:

- What changes as a result?
- What are the trade-offs?
- Who is affected?

---

## Notes

- Decisions are immutable once made (create new ADR to change)
- All significant architectural choices should be documented
- Include context, rationale, and alternatives
- Update status if decision is deprecated/superseded
```

---

### 7. HEALTH_CHECKS.md - Quality Gates

**Purpose**: Define and track automated quality checks

**Contents**:

- Health check mode configuration
- Automated check definitions
- Phase completion criteria
- Test execution benchmarks
- Health check history

**Example Structure**:

```markdown
# Health Check Protocol

> Quality gates and validation rules for ensuring system health

## Health Check Mode

**Current Mode**: `strict`

See [CONFIG.md](CONFIG.md) for mode configuration.

---

## Automated Health Checks

### Full Health Check

**Command**: `[your-test-command]`

**What it runs**:

1. Linting (all projects)
2. Unit tests (all projects)
3. Integration tests (all projects)

**Expected Outcome**: Exit code 0 (all checks pass)

**When to run**:

- Before ending a session (if in strict mode)
- Before committing major changes
- After completing a phase
- Before creating a pull request

**Current Status**: [✅ PASSING | ❌ FAILING]

---

## Individual Health Checks

### 1. Linting

**Command**: `[your-lint-command]`

**What it checks**:

- Code style compliance
- Best practices
- Type safety

**Success Criteria**:

- Exit code 0
- No errors
- Warnings acceptable if pre-existing

**Current Status**: [Status]

---

### 2. Unit Tests

**Command**: `[your-unit-test-command]`

**What it checks**:

- All unit tests across all projects
- No skipped tests (unless documented)

**Success Criteria**:

- Exit code 0
- All tests passing
- Skipped tests documented in BLOCKERS.md

**Current Status**: X/Y passing

---

### 3. Integration Tests

**Command**: `[your-integration-test-command]`

**What it checks**:

- End-to-end workflows
- System integration

**Success Criteria**:

- Exit code 0
- All integration tests passing

**Current Status**: X/Y passing

---

## Phase Health Checks

### Phase Completion Criteria

Before marking a phase as complete:

- [ ] All phase tasks completed
- [ ] All tests passing (or skips documented)
- [ ] Linting passing
- [ ] Documentation updated
- [ ] Decisions documented
- [ ] No unresolved blockers
- [ ] Code committed

---

## Test Execution Benchmarks

### Current Performance

| Test Suite  | Tests | Time | Status |
| ----------- | ----- | ---- | ------ |
| Unit        | X     | Xs   | ✅     |
| Integration | Y     | Ys   | ✅     |
| **Total**   | X+Y   | Zs   | ✅     |

### Performance Targets

- **Unit Tests**: <10s total
- **Integration Tests**: <30s total
- **Full Health Check**: <1 minute

---

## Health Check History

### Session X - YYYY-MM-DD

**Status**: [✅ PASSING | ❌ FAILING]

**Results**:

- Linting: [Status]
- Unit Tests: [Status]
- Integration Tests: [Status]

**Notes**:

- Note 1
- Note 2
```

---

### 8. SIDE_TASKS.md - Parallel Work

**Purpose**: Track nice-to-have improvements and parallel work

**Contents**:

- Active side tasks (ongoing improvements)
- Completed side tasks (with impact)
- Future side tasks (ideas)

**Example Structure**:

```markdown
# Side Tasks & Nice-to-Haves

> Parallel work and improvements that can be done alongside main tasks

## Active Side Tasks

### 📝 [Side Task Name]

**Priority**: [HIGH | MEDIUM | LOW]
**Effort**: ~X hours
**Status**: [🔄 ONGOING | 💡 IDEA]

**Tasks**:

- [ ] Task 1
- [ ] Task 2

**Why it matters**: [Justification]

---

## Completed Side Tasks

### ✅ [Completed Task] (Session X)

**Completed**: YYYY-MM-DD

**What was done**:

- Item 1
- Item 2

**Impact**: [How it improved the project]

---

## Future Side Tasks

### [Future Task]

**Priority**: [HIGH | MEDIUM | LOW]
**Effort**: ~X hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Task 1

**Why defer**: [Reason to defer]

---

## Notes

- Side tasks should not block main development
- Can be picked up during downtime or as learning opportunities
- Prioritize based on user feedback and pain points
```

---

## Session Protocols

### Session Start Protocol

Every agent session should start with this checklist:

```markdown
## Session Start Checklist

1. ✅ Read README.md "Current Sprint" section
2. ✅ Read .add/SESSION.md for latest state
3. ✅ Read .add/MEMORY.md for project context
4. ✅ Read .add/TASKS.md for current objectives
5. ✅ Check .add/BLOCKERS.md for obstacles
6. ✅ Update SESSION.md with new session start entry
```

**Purpose**: Restore full context and understand current state

### Session End Protocol

Every agent session should end with this checklist:

```markdown
## Session End Checklist

1. ✅ Mark completed tasks in TASKS.md
2. ✅ Update MEMORY.md with session learnings
3. ✅ Run health checks per CONFIG.md (if strict mode)
4. ✅ Document any architecture decisions in DECISIONS.md
5. ✅ Update BLOCKERS.md status
6. ✅ Write session summary in SESSION.md
7. ✅ Update README.md "Current Sprint" with latest status
8. ✅ Commit changes with descriptive message
```

**Purpose**: Persist knowledge and ensure quality

### Health Check Modes

**Strict Mode** (Recommended):

- All health checks must pass before session end
- Failing tests block session completion
- Ensures no regressions

**Warn Mode**:

- Health checks run but failures logged only
- Development continues despite failures
- Use for rapid prototyping

**Off Mode**:

- No automated health checks
- Manual verification only
- Not recommended for production projects

---

## Health Check System

### Configuring Health Checks

1. **Define Test Commands** in `.add/CONFIG.md`:

````markdown
### Test Commands

```bash
# Unit tests
dotnet test --filter Category=Unit

# Integration tests
dotnet test --filter Category=Integration

# All tests
dotnet test

# Linting
dotnet format --verify-no-changes
```
````

````

2. **Set Health Check Mode** in `.add/CONFIG.md`:

```markdown
### Health Check Mode

**Current Mode**: `strict`
````

3. **Run Health Checks** before session end:

```bash
# Run your project's health check command
npm run health-check
# or
dotnet test && dotnet format --verify-no-changes
# or
pytest && flake8
```

### Language-Specific Examples

**JavaScript/TypeScript**:

```json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "health-check": "npm run lint && npm test && npm run test:e2e"
  }
}
```

**C# (.NET)**:

```xml
<!-- Create a health-check.ps1 or health-check.sh -->
dotnet format --verify-no-changes
dotnet test --filter Category=Unit
dotnet test --filter Category=Integration
dotnet build --configuration Release
```

**Python**:

```bash
# health-check.sh
flake8 .
black --check .
pytest tests/unit
pytest tests/integration
```

**Java**:

```bash
# health-check.sh
./mvnw checkstyle:check
./mvnw test -Dgroups=unit
./mvnw test -Dgroups=integration
```

**Go**:

```bash
# health-check.sh
go fmt ./...
go vet ./...
go test ./... -short  # unit tests
go test ./...         # all tests
```

---

## Language-Specific Adaptations

### JavaScript/TypeScript Projects

**Typical Structure**:

```
project/
├── .add/
├── package.json           # Scripts and dependencies
├── jest.config.js         # Test configuration
├── .eslintrc.js          # Linting rules
└── tsconfig.json         # TypeScript config
```

**CONFIG.md Additions**:

````markdown
### Technology Stack

- Runtime: Node.js 18+
- Package Manager: npm/yarn/pnpm
- Test Framework: Jest/Vitest
- Linting: ESLint + Prettier

### Commands

```bash
npm install           # Install dependencies
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Production build
npm run lint         # Lint code
npm run health-check # Full health check
```
````

```

---

### C# (.NET) Projects

**Typical Structure**:
```

project/
├── .add/
├── src/
│ └── Project.sln
├── tests/
│ ├── Unit.Tests/
│ └── Integration.Tests/
└── .editorconfig

````

**CONFIG.md Additions**:
```markdown
### Technology Stack
- Framework: .NET 8.0
- Language: C# 12
- Test Framework: xUnit/NUnit/MSTest
- Linting: dotnet format + StyleCop

### Commands
```bash
dotnet restore                    # Restore dependencies
dotnet build                      # Build solution
dotnet test                       # Run all tests
dotnet test --filter Category=Unit        # Unit tests only
dotnet format --verify-no-changes # Check formatting
````

````

**MEMORY.md Patterns**:
```markdown
## C# Patterns & Best Practices

### Dependency Injection Pattern

```csharp
// Startup.cs or Program.cs
services.AddScoped<IUserService, UserService>();
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));
````

### Async/Await Pattern

```csharp
public async Task<User> GetUserAsync(int id)
{
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Id == id);
}
```

### Common Gotchas

**Problem**: ConfigureAwait confusion
**Solution**: Use ConfigureAwait(false) in library code

```csharp
var result = await SomeMethodAsync().ConfigureAwait(false);
```

```

---

### Python Projects

**Typical Structure**:
```

project/
├── .add/
├── src/
├── tests/
├── requirements.txt
├── pyproject.toml
└── .flake8

````

**CONFIG.md Additions**:
```markdown
### Technology Stack
- Python: 3.11+
- Package Manager: pip/poetry
- Test Framework: pytest
- Linting: flake8/black/ruff

### Commands
```bash
pip install -r requirements.txt  # Install dependencies
python -m pytest                 # Run tests
black --check .                  # Check formatting
flake8 .                        # Lint code
````

```

---

### Java Projects

**Typical Structure**:
```

project/
├── .add/
├── src/
│ ├── main/java/
│ └── test/java/
├── pom.xml (Maven)
└── build.gradle (Gradle)

````

**CONFIG.md Additions**:
```markdown
### Technology Stack
- Java: 17+
- Build Tool: Maven/Gradle
- Test Framework: JUnit 5
- Linting: Checkstyle/PMD

### Commands (Maven)
```bash
./mvnw clean install      # Build and install
./mvnw test              # Run tests
./mvnw checkstyle:check  # Check style
````

### Commands (Gradle)

```bash
./gradlew build          # Build project
./gradlew test           # Run tests
./gradlew check          # Run all checks
```

```

---

### Go Projects

**Typical Structure**:
```

project/
├── .add/
├── cmd/
├── internal/
├── pkg/
├── go.mod
└── go.sum

````

**CONFIG.md Additions**:
```markdown
### Technology Stack
- Go: 1.21+
- Test Framework: testing package
- Linting: golangci-lint

### Commands
```bash
go mod download          # Download dependencies
go build ./...          # Build all packages
go test ./...           # Run all tests
go test -short ./...    # Run unit tests only
go vet ./...            # Examine code
golangci-lint run       # Run linters
````

````

---

## Best Practices

### 1. Never Delete History

**Rule**: SESSION.md and DECISIONS.md are append-only

**Why**: Historical context is invaluable for understanding why decisions were made

**Example**:
```markdown
# ❌ DON'T: Delete old sessions
# ✅ DO: Keep all sessions and mark as complete

## Session 5 - 2025-12-05
**Status**: ✅ COMPLETE
[Keep this forever]

## Session 4 - 2025-12-04
**Status**: ✅ COMPLETE
[Keep this too]
````

---

### 2. Accumulate Knowledge in MEMORY.md

**Rule**: MEMORY.md should only grow, never shrink

**Why**: Patterns and gotchas are learned over time and should be preserved

**Example**:

```markdown
# ✅ DO: Add new learnings

## New Pattern Discovered (Session 12)

### Error Handling Pattern

[New pattern details]

## Original Pattern (Session 3)

### Basic Pattern

[Original pattern - keep this!]
```

---

### 3. Document Decisions Immediately

**Rule**: Create ADR entries as soon as architectural decisions are made

**Why**: Context is fresh and rationale is clear

**Example**:

```markdown
# ✅ DO: Document while context is fresh

### ADR-005: Use PostgreSQL for Data Storage (2025-12-06)

**Context**: Need to choose database for user data

**Decision**: Use PostgreSQL

**Rationale**:

- ACID compliance required
- Complex queries needed
- Team has PostgreSQL experience

[Document immediately, not later]
```

---

### 4. Update README.md Current Sprint Every Session

**Rule**: README.md "Current Sprint" should always reflect current state

**Why**: It's the first thing anyone reads

**Example**:

```markdown
# ✅ DO: Update at session end

## Current Sprint

**Status**: 🔄 IN PROGRESS
**Focus**: Authentication Implementation

**Quick Stats**:

- Tests: ✅ 150/152 passing
- Build: ✅ Passing
- Linting: ✅ Clean

**Last Updated**: 2025-12-06 (Session 5)
```

---

### 5. Run Health Checks in Strict Mode

**Rule**: Use strict mode for production projects

**Why**: Catch regressions before they're committed

**Example**:

```markdown
# .add/CONFIG.md

### Health Check Mode

**Current Mode**: `strict`

# ✅ DO: Enforce quality gates

# Before session end, run:

npm run health-check

# If fails, fix before committing
```

---

### 6. Use Conventional Commits

**Rule**: Follow conventional commit format

**Why**: Clear history and automated changelogs

**Example**:

```bash
# ✅ DO: Use conventional commits

feat(auth): implement JWT authentication
fix(api): resolve null reference in user service
docs: update MEMORY.md with new patterns
test(auth): add integration tests for login flow
chore: update dependencies

# ❌ DON'T: Vague commits
git commit -m "updates"
git commit -m "fixed stuff"
```

---

### 7. Track Blockers Immediately

**Rule**: Document blockers as soon as they're encountered

**Why**: Prevents forgotten issues and helps find patterns

**Example**:

```markdown
# ✅ DO: Document blockers immediately

### 🚫 Database Migration Failure

**Blocked**: Deployment
**Date Identified**: 2025-12-06
**Impact**: Cannot deploy to production

**Problem**: Migration script fails on production database

**Attempted Solutions**:

1. Re-run migration ❌ Failed
2. Manual SQL script ❌ Failed

[Update BLOCKERS.md right away, not at session end]
```

---

### 8. Separate Side Tasks from Main Tasks

**Rule**: Keep nice-to-haves in SIDE_TASKS.md, not TASKS.md

**Why**: Prevents scope creep and maintains focus

**Example**:

```markdown
# ✅ TASKS.md - Critical work only

## Active Tasks

#### 1. Implement User Authentication

**Priority**: HIGH
**Status**: in_progress

# ✅ SIDE_TASKS.md - Nice-to-haves

## Active Side Tasks

### 📝 Add Dark Mode Support

**Priority**: LOW
**Status**: 💡 IDEA
```

---

## Templates

### CONFIG.md Template

```markdown
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

1. **Linting**: All projects must pass linter checks
2. **Unit Tests**: All unit tests must pass (skipped tests documented)
3. **Integration Tests**: All integration tests must pass (optional)
4. **Build**: All projects must build successfully (optional)
5. **Type Check**: All type checks must pass (language-specific)

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
feat(auth): implement JWT authentication

- Added JWT token generation
- Created auth middleware
- Added login/logout endpoints
- All tests passing (25/25)

🤖 Generated with [Your Agent Name]
```

## Project-Specific Settings

### Technology Stack

- **Language**: [Your language]
- **Framework**: [Your framework]
- **Build Tool**: [Your build tool]
- **Test Framework**: [Your test framework]

### Test Commands

```bash
# Add your test commands here
[test-command]       # Unit tests
[e2e-command]        # Integration tests
[lint-command]       # Linting
[health-command]     # Full health check
```

### Build Commands

```bash
# Add your build commands here
[build-command]      # Production build
[dev-command]        # Development server
```

### Database Commands (if applicable)

```bash
# Add database commands here
[migrate-command]    # Run migrations
[seed-command]       # Seed database
```

````

---

### SESSION.md Template

```markdown
# Session Log

## Current Session

**Session Number**: 1
**Date**: YYYY-MM-DD
**Status**: 🔄 IN PROGRESS
**Focus**: [Main focus area]

### Session Objectives

- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

### Session Notes

[Notes will be added as the session progresses]

### Key Learnings

[Learnings will be documented at session end]

---

## Historical Context

### Project Overview

**Objective**: [High-level project goal]

**Success Criteria**:
- Criterion 1
- Criterion 2
- Criterion 3

**Technology Stack**:
- [Technology 1]
- [Technology 2]
- [Technology 3]

### Phase Progress

- ⏳ Phase 1: [Phase name] (PENDING)
  - 1.1: [Sub-phase]
  - 1.2: [Sub-phase]
- ⏳ Phase 2: [Phase name] (PENDING)
  - 2.1: [Sub-phase]
````

---

### MEMORY.md Template

````markdown
# Project Memory

> Persistent learnings, patterns, and gotchas. This document accumulates knowledge and never shrinks.

## Patterns & Best Practices

### [Pattern Category]

**Pattern Name**:

```[language]
// Code example
```
````

**Key Points**:

- Point 1
- Point 2
- Point 3

---

## Common Gotchas

### [Gotcha Name]

**Problem**: [Description of the problem]

**Solution**: [How to solve it]

```[language]
// Solution code
```

**Why it happens**: [Explanation]

---

## Technology-Specific Knowledge

### [Technology/Framework Name]

**Best Practice**:

```[language]
// Example code
```

**Explanation**: [Why this is best practice]

---

## Development Workflow

### [Workflow Name]

**Steps**:

1. Step 1
2. Step 2
3. Step 3

**Commands**:

```bash
command1  # Description
command2  # Description
```

---

## Project-Specific Decisions

### [Decision Area]

**Decision**: [What was decided]

**Rationale**:

- Reason 1
- Reason 2

**Trade-offs**:

- Trade-off 1
- Trade-off 2

---

## Common Commands

### [Category]

```bash
command1  # What it does
command2  # What it does
command3  # What it does
```

### [Another Category]

```bash
command4  # What it does
command5  # What it does
```

````

---

### TASKS.md Template

```markdown
# Active Tasks

## Current Sprint

**Sprint Goal**: [Goal description]

**Status**: 🔄 IN PROGRESS

### Active Tasks

#### 1. [Task Name] ⏳

**Status**: pending
**Priority**: HIGH
**Assignee**: Agent

**Subtasks**:

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

**Next Steps**:

1. Step 1
2. Step 2

---

## Future Work

### [Future Phase/Feature]

**Status**: ⏳ PENDING
**Prerequisites**: [List prerequisites]

**Tasks**:

- [ ] Task 1
- [ ] Task 2

---

## Backlog

### [Enhancement Name]

**Status**: 💡 IDEA
**Priority**: MEDIUM
**Effort**: ~X hours

**Description**: [What to build]

**Tasks**:

- [ ] Task 1
- [ ] Task 2

**Benefits**:
- Benefit 1
- Benefit 2

---

## Completed Tasks

### ✅ [Completed Task] (Session X)

**Completed**: YYYY-MM-DD
**Effort**: X hours

**What was delivered**:
- Item 1
- Item 2

**Outcomes**:
- Outcome 1
- Outcome 2
````

---

### BLOCKERS.md Template

````markdown
# Blockers & Obstacles

> Current obstacles and mitigation plans. Update immediately when blockers are encountered.

## Active Blockers

### 🚫 No Active Blockers

All systems operational. Ready for next task.

---

## Resolved Blockers

[Resolved blockers will be added here as they occur]

---

## Potential Future Blockers

### ⚠️ [Potential Issue Name]

**Risk Level**: MEDIUM
**Probability**: X%

**Potential Issue**: [Description]

**Mitigation Strategy**:

1. Prevention step 1
2. Prevention step 2

**Monitoring**: [How to monitor for this issue]

---

## Blocker Template

```markdown
### [🚫 Active | ✅ Resolved | ⚠️ Potential] Title

**Blocked**: [What is blocked?]
**Date Identified**: YYYY-MM-DD
**Impact**: [How severe is the impact?]

**Problem**:

- Describe the issue
- What's not working?
- Error messages

**Attempted Solutions**:

1. Solution 1 [✅ Worked | ❌ Failed]
2. Solution 2 [✅ Worked | ❌ Failed]

**Resolution**: [How was it resolved?]

**Date Resolved**: YYYY-MM-DD (if resolved)

**Lessons Learned**:

- Key takeaway 1
- Key takeaway 2
```
````

---

## Notes

- Update this file immediately when blockers are encountered
- Include all attempted solutions, even failed ones
- Document resolution for future reference
- Move to "Resolved Blockers" when fixed
- Extract lessons learned for MEMORY.md

````

---

### DECISIONS.md Template

```markdown
# Architecture Decision Records (ADRs)

> Immutable log of architectural decisions. Each entry documents a decision, its context, and rationale.

## Decision Log

[ADR entries will be added here as decisions are made]

---

## Decision Template

```markdown
### ADR-XXX: [Decision Title] (YYYY-MM-DD)

**Status**: [🔄 PROPOSED | ✅ ACCEPTED | ❌ REJECTED | ⚠️ DEPRECATED]

**Context**:

- What is the issue we're facing?
- What constraints exist?
- What are the requirements?

**Decision**: [What are we deciding to do?]

**Rationale**:

- Why this decision?
- What are the benefits?
- What problems does it solve?

**Alternatives Considered**:

- Alternative 1 (rejected: reason)
- Alternative 2 (rejected: reason)

**Implementation**:

- How will we implement this?
- Key code examples or configuration

```[language]
// Code example if applicable
````

**Impact**:

- What changes as a result?
- What are the trade-offs?
- Who is affected?

```

---

## Notes

- Decisions are immutable once made (create new ADR to change/supersede)
- All significant architectural choices should be documented
- Include context, rationale, and alternatives
- Update status if decision is deprecated/superseded
- Link to related ADRs when applicable
```

---

### HEALTH_CHECKS.md Template

````markdown
# Health Check Protocol

> Quality gates and validation rules for ensuring system health

## Health Check Mode

**Current Mode**: `strict`

See [CONFIG.md](CONFIG.md) for mode configuration.

---

## Automated Health Checks

### Full Health Check

**Command**: `[your-health-check-command]`

**What it runs**:

1. Linting (all projects)
2. Unit tests (all projects)
3. Integration tests (all projects)

**Expected Outcome**: Exit code 0 (all checks pass)

**When to run**:

- Before ending a session (if in strict mode)
- Before committing major changes
- After completing a phase
- Before creating a pull request

**Current Status**: ⏳ NOT RUN YET

---

## Individual Health Checks

### 1. Linting

**Command**: `[your-lint-command]`

**What it checks**:

- Code style compliance
- Import ordering
- Best practices
- Code style consistency

**Success Criteria**:

- Exit code 0
- No errors
- Warnings acceptable if pre-existing

**Current Status**: ⏳ NOT RUN YET

**Individual Commands**:

```bash
[lint-command-1]  # Lint project 1
[lint-command-2]  # Lint project 2
```
````

---

### 2. Unit Tests

**Command**: `[your-unit-test-command]`

**What it checks**:

- All unit tests across all projects
- Test coverage (optional)
- No skipped tests (unless documented)

**Success Criteria**:

- Exit code 0
- All tests passing
- Skipped tests documented in BLOCKERS.md

**Current Status**: ⏳ NOT RUN YET

**Individual Commands**:

```bash
[test-command-1]  # Test project 1
[test-command-2]  # Test project 2
```

---

### 3. Integration Tests

**Command**: `[your-integration-test-command]`

**What it checks**:

- Integration of components/services
- Real dependencies
- End-to-end workflows

**Success Criteria**:

- Exit code 0
- All integration tests passing

**Current Status**: ⏳ NOT RUN YET

**Prerequisites**:

- Database running (if applicable)
- Environment variables configured
- External services available

---

### 4. Build Check

**Command**: `[your-build-command]`

**What it checks**:

- Compilation/transpilation
- Bundling
- No build errors

**Success Criteria**:

- Exit code 0
- All projects build successfully
- No compilation errors

**Current Status**: ⏳ NOT RUN YET

**Note**: Build check is optional and can be deferred for faster iteration

---

## Phase Health Checks

### Phase Completion Criteria

Before marking a phase as complete:

- [ ] All phase tasks completed
- [ ] All tests passing (or skips documented)
- [ ] Linting passing
- [ ] Documentation updated (ARCHITECTURE.md, SESSION.md)
- [ ] Decisions documented (DECISIONS.md)
- [ ] No unresolved blockers
- [ ] Code committed with conventional commit message

---

## Test Execution Benchmarks

### Current Performance

| Test Suite  | Tests | Time | Status     |
| ----------- | ----- | ---- | ---------- |
| Unit        | 0     | 0s   | ⏳ Not Run |
| Integration | 0     | 0s   | ⏳ Not Run |
| **Total**   | 0     | 0s   | ⏳ Not Run |

### Performance Targets

- **Unit Tests**: <10s total
- **Integration Tests**: <30s total
- **Full Health Check**: <1 minute
- **Build**: <2 minutes

---

## Continuous Monitoring

### What to Monitor

1. **Test Pass Rate**: Should stay ≥95%
2. **Build Time**: Should not increase significantly
3. **Lint Warnings**: Should not increase
4. **Dependencies**: Keep up to date (security audits)

### Red Flags

- Tests that start failing intermittently
- Build times increasing significantly
- New lint errors introduced
- Security vulnerabilities in dependencies

### Response Protocol

If health checks fail:

1. Investigate root cause immediately
2. Document in BLOCKERS.md
3. Create mitigation plan
4. Fix before continuing
5. Update health check if needed

---

## Health Check History

### Session 1 - YYYY-MM-DD

**Status**: ⏳ NOT RUN YET

**Results**:

- Linting: [Status]
- Unit Tests: [Status]
- Integration Tests: [Status]
- Build: [Status]

**Notes**:

- Note 1
- Note 2

---

## Manual Health Checks (Optional)

### Smoke Tests

Before ending a session, manually verify:

1. **Application Starts**: [Command to start]
2. **Core Feature 1 Works**: [Description]
3. **Core Feature 2 Works**: [Description]
4. **No Console Errors**: Check browser/terminal

**Time**: ~5 minutes

---

## Notes

- Health checks are enforced in strict mode (see CONFIG.md)
- All check failures must be documented in BLOCKERS.md
- Skipped tests must be justified and documented
- Health check history helps track project quality over time
- When in doubt, run the full health check

````

---

### SIDE_TASKS.md Template

```markdown
# Side Tasks & Nice-to-Haves

> Parallel work and improvements that can be done alongside main tasks

## Active Side Tasks

[No active side tasks yet]

---

## Completed Side Tasks

[Completed side tasks will be listed here]

---

## Future Side Tasks

### 📝 [Future Improvement]

**Priority**: LOW
**Effort**: ~X hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Task 1
- [ ] Task 2

**Why defer**: [Reason to defer]

---

## Side Task Template

```markdown
### [Icon] [Task Name]

**Priority**: [HIGH | MEDIUM | LOW]
**Effort**: ~X hours
**Status**: [🔄 ONGOING | 💡 IDEA | ✅ COMPLETE]

**Tasks**:

- [ ] Task 1
- [ ] Task 2

**Why it matters**: [Justification]

**Why defer**: [Reason to defer - for future tasks]
````

---

## Notes

- Side tasks should not block main development
- Can be picked up during downtime or as learning opportunities
- Prioritize based on user feedback and pain points
- Document decisions in DECISIONS.md if choosing to implement

```

---

## Conclusion

The ADD Framework provides a structured approach to AI agent development that:

✅ **Maintains Context** across sessions through persistent memory
✅ **Ensures Quality** through automated health checks
✅ **Documents Decisions** for future reference
✅ **Tracks Progress** transparently
✅ **Works with Any Language** (JavaScript, C#, Python, Java, Go, etc.)

### Getting Started

1. Create `.add/` directory in your project
2. Copy templates from this document
3. Customize CONFIG.md for your tech stack
4. Update README.md with "Current Sprint" section
5. Start your first session following Session Protocols

### Support & Contributions

This framework is designed to be self-contained and adaptable. Customize it to fit your project's needs while maintaining the core philosophy:

- **Never delete history**
- **Accumulate knowledge**
- **Document decisions**
- **Enforce quality**

---

**Version**: 1.0
**Last Updated**: 2025-12-06
**Framework Size**: ~8 files, ~50KB total
**Maintenance**: Low (update only when adding new patterns)

---

## Quick Reference

| Task | File | Action |
|------|------|--------|
| Configure framework | CONFIG.md | Set health check mode, commands |
| Start session | SESSION.md | Read last session, add new entry |
| Learn pattern | MEMORY.md | Add to appropriate section |
| Track work | TASKS.md | Create/update tasks |
| Hit blocker | BLOCKERS.md | Document immediately |
| Make decision | DECISIONS.md | Create new ADR |
| Run tests | HEALTH_CHECKS.md | Document results |
| Add nice-to-have | SIDE_TASKS.md | Track parallel work |

---

**End of Document**

🤖 This framework is designed to be copied and adapted for your specific needs. May your AI agents have perfect memory!
```
