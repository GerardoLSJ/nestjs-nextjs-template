# ADD Framework Bootloader

> **Version**: 2.0.0 | **Entry Point**: `@entry-point` | **Target**: Haiku 4.5 / Sonnet 4.5

## Quick Command

```
@entry-point [command] [args...]
```

---

## 🚀 Boot Sequence

When you see `@entry-point`, execute this sequence:

### Phase 0: Load Core (Always ~2K tokens)

```
READ: .add/BOOTLOADER.md     ← You are here
READ: .add/manifest.json     ← Context index
READ: .add/core/project.md   ← Tech stack & conventions
```

### Phase 1: Determine Task Type

Parse command and map to context requirements:

| Command | Context Segments | Estimated Tokens |
|---------|------------------|------------------|
| `develop-feature <name>` | core + feature-template + relevant-modules | ~4-6K |
| `fix-bug <issue>` | core + error-patterns + affected-modules | ~3-5K |
| `refactor <target>` | core + architecture + target-module | ~4-6K |
| `review <scope>` | core + standards + scope-files | ~3-4K |
| `continue` | core + active-session | ~3-5K |
| `status` | core + session-summary | ~2K |

### Phase 2: Load Selective Context

```typescript
// Pseudocode for context selection
const context = await loadContext({
  always: ['core/project.md', 'core/agents.md'],
  taskSpecific: manifest.getSegments(command, args),
  budget: getTokenBudget(targetModel), // Haiku: 8K, Sonnet: 16K, Opus: 32K
});
```

### Phase 3: Execute or Delegate

```
IF task.complexity <= 'simple' AND targetModel == 'haiku':
  → Execute directly with loaded context
ELSE IF task.complexity == 'complex':
  → Opus plans, creates sub-tasks, delegates to Haiku
ELSE:
  → Sonnet handles with full context
```

---

## 📋 Entry Point Commands

### `@entry-point develop-feature <feature-name>`

Creates a new feature with full context loading.

**Context Loaded**:
- Core project context
- Feature template
- Related module documentation
- Active session state

**Output**: Creates `.add/sessions/active/<feature-name>.md`

---

### `@entry-point continue`

Resumes the most recent active session.

**Context Loaded**:
- Core project context  
- Active session file
- Task progress state
- Any blockers

---

### `@entry-point status`

Quick overview without full context load.

**Context Loaded**: Minimal (core + session summary)

---

### `@entry-point handoff <task-id> --to <model>`

Delegates a task to a smaller model with compressed context.

**Process**:
1. Opus/Sonnet compresses relevant context
2. Creates handoff package in `.add/handoffs/<task-id>.md`
3. Haiku receives: compressed context + specific task + success criteria

---

## 🧠 Context Budget Strategy

### Token Budgets by Model

| Model | Max Context | Reserved for Response | Available for Memory |
|-------|-------------|----------------------|---------------------|
| Haiku 4.5 | 200K | 8K | ~8-12K recommended |
| Sonnet 4.5 | 200K | 16K | ~16-24K recommended |
| Opus 4.5 | 200K | 32K | ~32-48K recommended |

### Loading Priority

1. **Critical** (always load): `BOOTLOADER.md`, `manifest.json`, `core/project.md`
2. **Task-specific** (load by command): relevant modules, feature docs
3. **On-demand** (load if referenced): deep documentation, historical decisions

---

## 🔄 Session Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│  @entry-point develop-feature auth-refresh              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  BOOT: Load BOOTLOADER.md + manifest.json               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  RESOLVE: manifest.resolve('develop-feature', 'auth')   │
│  → Returns: ['core/*', 'memory/modules/auth.md']        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  LOAD: Read & concatenate context segments              │
│  → Total: ~4.2K tokens                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  EXECUTE: Create session, begin development             │
│  → Output: .add/sessions/active/auth-refresh.md         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CHECKPOINT: Update session state periodically          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  COMPLETE: Persist learnings to MEMORY.md               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ For Agent Implementation

When you (the agent) receive `@entry-point`:

1. **Parse** the command from user input
2. **Read** this file + `manifest.json`
3. **Resolve** which segments to load based on command
4. **Load** segments respecting token budget
5. **Execute** the task with loaded context
6. **Persist** any new learnings back to memory

### Example Agent Response Pattern

```markdown
## 🚀 Booting ADD Framework...

**Command**: `develop-feature auth-refresh`
**Context Budget**: 8K tokens (Haiku mode)

### Loading Context...
- ✅ core/project.md (800 tokens)
- ✅ core/agents.md (400 tokens)  
- ✅ memory/modules/auth.md (1200 tokens)
- ✅ sessions/active/ (checking for existing...)
- ⏭️ Skipped: memory/modules/database.md (not relevant)

**Total Loaded**: 2,400 tokens | **Budget Remaining**: 5,600 tokens

### Ready to Execute
[Proceeds with feature development...]
```

---

## 📁 Required File Structure

```
.add/
├── BOOTLOADER.md          ← This file (entry point)
├── manifest.json          ← Context index & routing
├── core/
│   ├── project.md         ← Always loaded
│   ├── agents.md          ← Agent roles & protocols
│   └── glossary.md        ← Domain terminology
├── memory/
│   ├── modules/           ← Per-module knowledge
│   ├── features/          ← Feature-specific context
│   └── decisions/         ← ADRs
├── sessions/
│   ├── active/            ← Current work
│   └── archive/           ← Completed sessions
├── handoffs/              ← Cross-model delegation
└── prompts/
    └── entry-points/      ← Command templates
```

---

## ⚡ VS Code / Claude Code Integration

### CLAUDE.md Integration

Add to your project's `CLAUDE.md`:

```markdown
## Entry Point

For any development task, use the ADD Framework bootloader:

@entry-point <command> <args>

Before starting work, ALWAYS:
1. Read `.add/BOOTLOADER.md`
2. Follow the boot sequence
3. Load appropriate context from manifest
4. Create/resume session in `.add/sessions/active/`
```

### Slash Command (Claude Code)

```
/add develop-feature <name>
/add continue
/add status
```

---

*Bootloader v2.0.0 | Hierarchical Context | Model-Aware Loading*
