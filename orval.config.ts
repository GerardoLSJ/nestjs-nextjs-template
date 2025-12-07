import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:3333/api/docs-json',
    },
    output: {
      mode: 'tags-split',
      target: 'apps/web/src/lib/api/generated/api.ts',
      schemas: 'apps/web/src/lib/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'apps/web/src/lib/api/client.ts',
          name: 'customFetch',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
