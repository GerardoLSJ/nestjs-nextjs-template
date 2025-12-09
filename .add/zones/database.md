# Zone: Database Layer

<!-- @zone-id: database -->
<!-- @confidence: 0.90 -->
<!-- @languages: prisma, typescript -->
<!-- @test-coverage: full -->

## Boundaries

- Path: `prisma/**/*`

## Testing Capabilities

- Unit tests: N/A (schema files)
- Integration tests: Yes (via API tests)
- Migration tests: Manual

## Key Files

- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Migration history

## Known Gotchas

1. Always run `npx prisma generate` after schema changes
2. Migrations require DATABASE_URL environment variable
3. Soft deletes not implemented - cascading deletes in schema

## Pattern Exceptions

- None currently
