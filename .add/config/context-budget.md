# Context Budget Configuration

## Limits by Tier

| Tier | Soft Limit  | Hard Limit  |
| ---- | ----------- | ----------- |
| 1    | 150k tokens | 180k tokens |
| 2    | 80k tokens  | 100k tokens |
| 3    | 30k tokens  | 40k tokens  |

## Loading Priority

1. **Critical**: BOOTLOADER, active session, target zone gotchas
2. **High**: Target files, direct dependencies, relevant ADRs
3. **Medium**: Zone patterns, historical decisions
4. **Low**: Full project brief, other zones, archived sessions

## At Soft Limit

Prompt user with options:

1. Narrow scope
2. Split task
3. Escalate to higher tier
4. Proceed with compressed context
