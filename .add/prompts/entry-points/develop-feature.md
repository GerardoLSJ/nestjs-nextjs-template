# Entry Point: develop-feature

> Template for `@entry-point develop-feature <feature-name>`

## Boot Sequence

```
1. READ  → .add/BOOTLOADER.md
2. READ  → .add/manifest.json  
3. LOAD  → core/* (always)
4. MATCH → feature keywords against segment triggers
5. LOAD  → matched segments (respect budget)
6. CHECK → .add/sessions/active/ for existing session
7. CREATE/RESUME → session file
8. EXECUTE → development workflow
```

## Session File Template

Create `.add/sessions/active/<feature-name>.md`:

```markdown
# Session: <feature-name>

## Metadata
| Field | Value |
|-------|-------|
| Created | {{timestamp}} |
| Last Updated | {{timestamp}} |
| Status | 🔄 IN_PROGRESS |
| Model | {{model}} |
| Context Loaded | {{segments}} |

## Objective
{{user_description or inferred from feature name}}

## Loaded Context
- core/project.md ✅
- core/agents.md ✅
- {{matched segments}}

## Plan
### Phase 1: Setup
- [ ] Task 1.1
- [ ] Task 1.2

### Phase 2: Implementation  
- [ ] Task 2.1
- [ ] Task 2.2

### Phase 3: Testing
- [ ] Task 3.1
- [ ] Task 3.2

## Progress Log

### {{timestamp}}
- Started session
- Loaded context: {{tokens}} tokens
- Initial analysis: ...

## Files Modified
| File | Action | Description |
|------|--------|-------------|

## Decisions Made
| Decision | Rationale | Timestamp |
|----------|-----------|-----------|

## Blockers
None currently.

## Handoffs
| Task ID | Delegated To | Status |
|---------|--------------|--------|

## Next Session
- [ ] Priority item for next session
```

## Workflow

### 1. Analyze Feature

```markdown
## Feature Analysis: <feature-name>

**Type**: [new-feature | enhancement | integration]
**Scope**: [single-module | cross-module | full-stack]
**Complexity**: [simple | medium | complex]

**Affected Areas**:
- Backend: [modules]
- Frontend: [components]
- Database: [yes/no - migrations needed?]
- Tests: [unit | integration | e2e]
```

### 2. Generate Plan

Based on complexity:

**Simple** (Haiku can execute):
- Single file changes
- No new patterns
- Clear implementation path

**Medium** (Sonnet executes, may delegate):
- Multiple files
- Follows existing patterns
- Some decisions needed

**Complex** (Opus plans, Sonnet/Haiku execute):
- Architectural impact
- New patterns introduced
- Multiple phases

### 3. Execute with Checkpoints

After each significant change:
- Update session progress
- Commit with conventional message
- Run relevant tests
- Update MEMORY.md if new patterns discovered

### 4. Complete Session

```markdown
## Session Complete

**Summary**: {{what was accomplished}}
**Files Changed**: {{count}}
**Tests**: {{passed/total}}
**Duration**: {{time}}

**Learnings Added to MEMORY.md**:
- {{learning 1}}
- {{learning 2}}

**Follow-up Tasks**:
- [ ] {{if any}}
```

---

## Example Usage

User: `@entry-point develop-feature user-preferences`

Agent Response:

```markdown
## 🚀 Booting ADD Framework...

**Command**: develop-feature user-preferences
**Model**: Sonnet 4.5
**Context Budget**: 16K tokens

### Loading Context...
- ✅ core/project.md (800 tokens)
- ✅ core/agents.md (400 tokens)
- ✅ memory/modules/auth.md (1200 tokens) ← matched "user"
- ✅ memory/modules/database.md (1000 tokens) ← matched "preferences"
- ✅ memory/modules/api.md (900 tokens) ← new endpoint needed
- ⏭️ sessions/active/ (no existing session)

**Total**: 4,300 tokens | **Remaining**: 11,700 tokens

### Creating Session...
→ .add/sessions/active/user-preferences.md

### Feature Analysis

**Type**: new-feature
**Scope**: full-stack  
**Complexity**: medium

**Plan**:
1. Database: Add preferences schema to Prisma
2. Backend: Create PreferencesModule (service, controller, DTOs)
3. Frontend: Settings page with preference controls
4. Tests: Unit + integration tests

Shall I proceed with Phase 1?
```

---

*This template ensures consistent feature development workflow*
