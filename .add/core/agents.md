# Agent Roles & Protocols

> **Always Loaded** | ~400 tokens

## Model Hierarchy

```
┌─────────────────────────────────────────────────┐
│  OPUS 4.5 - Orchestrator                        │
│  • Architecture decisions                       │
│  • Complex planning                             │
│  • Context compression for handoff              │
│  • Quality gates & review                       │
└─────────────────────────────────────────────────┘
                      │
                      ▼ delegates
┌─────────────────────────────────────────────────┐
│  SONNET 4.5 / GEMINI 3 PRO - Builder            │
│  • Feature implementation                       │
│  • Debugging & refactoring                      │
│  • Integration work                             │
│  • Can delegate simple sub-tasks                │
└─────────────────────────────────────────────────┘
                      │
                      ▼ delegates
┌─────────────────────────────────────────────────┐
│  HAIKU 4.5 - Executor                           │
│  • Simple code generation                       │
│  • Unit tests                                   │
│  • Documentation                                │
│  • Single-file changes                          │
└─────────────────────────────────────────────────┘
```

## Handoff Protocol

### From Opus/Sonnet/Gemini → Haiku

Create `.add/handoffs/<task-id>.md`:

```markdown
# Handoff: <task-id>

## Context (compressed)

[Relevant context, max 2K tokens]

## Task

[Specific, atomic task description]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Constraints

- Do not modify: [files]
- Must use: [patterns]

## Return Protocol

Update session file when complete.
```

### Haiku Response Pattern

```markdown
## Completed: <task-id>

### Changes Made

- file1.ts: [description]
- file2.ts: [description]

### Tests Added/Updated

- [test files]

### Notes for Orchestrator

[Any issues, questions, or observations]
```

## Escalation Rules

Haiku MUST escalate to Sonnet/Gemini/Opus when:

- Task requires multi-file coordination
- Architectural decisions needed
- Unclear requirements
- Test failures it cannot resolve

## Session Continuity

All models MUST:

1. Read session state before starting
2. Update session state after changes
3. Log decisions to `DECISIONS.md`
4. Persist learnings to `MEMORY.md`

---

## Emergency Signals

When encountering issues, emit these signals:

- `STUCK: [description]` - 3+ consecutive failures on same task
- `ESCALATE: [reason]` - Task requires higher-tier capabilities
- `MISSING: [information]` - Cannot proceed without clarification
- `BLOCKED: [constraint]` - Action violates documented constraint

**Upon emitting any signal**: Stop work, document state, await guidance.

## Extended Signals (v3.1)

- `UNCERTAIN: [description]` - Confidence below threshold, need verification
- `CONTRADICTION: [file1] vs [file2]` - Memory files conflict, need resolution
- `ZONE_BOUNDARY: [zone1] -> [zone2]` - Cross-zone task, confirm approach
- `STALE: [file] last verified [date]` - Documentation exceeds age threshold
- `NO_TEST_PATH: [zone]` - No automated verification available

---

_Protocols ensure smooth multi-model collaboration_
