# Zone: Web Frontend

<!-- @zone-id: web -->
<!-- @confidence: 0.85 -->
<!-- @languages: typescript, tsx -->
<!-- @test-coverage: partial -->

## Boundaries

- Path: `apps/web/**/*`

## Testing Capabilities

- Unit tests: Yes (Jest)
- Integration tests: Limited
- E2E tests: Yes (Playwright)

## Key Modules

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/hooks/` - Custom hooks (useAuth, useEvents)
- `src/lib/` - Utilities and generated API client
- `src/styles/` - CSS Modules

## Known Gotchas

1. NEXT_PUBLIC_API_URL must be set at build time for Docker
2. App Router requires 'use client' directive for client components
3. Generated API client (Orval) should be regenerated after OpenAPI changes

## Pattern Exceptions

- None currently
