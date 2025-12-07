import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

/**
 * Creates a new QueryClient for each test with sensible defaults
 * that disable retries and caching to make tests more predictable.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests to make them faster and more predictable
        retry: false,
        // Disable caching to ensure each test starts fresh
        gcTime: 0,
      },
      mutations: {
        // Disable retries for mutations as well
        retry: false,
      },
    },
  });
}

/**
 * Custom render function that wraps components with QueryClientProvider
 *
 * This should be used instead of @testing-library/react's render function
 * when testing components that use TanStack Query hooks.
 *
 * @example
 * ```tsx
 * import { renderWithQueryClient } from '../../test/utils';
 * import LoginPage from './page';
 *
 * test('renders login form', () => {
 *   renderWithQueryClient(<LoginPage />);
 *   expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithQueryClient(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult & { queryClient: QueryClient } {
  const testQueryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    // Return the query client instance for advanced testing scenarios
    queryClient: testQueryClient,
  };
}

/**
 * Creates a QueryClient wrapper for use with renderHook from @testing-library/react
 *
 * @example
 * ```tsx
 * import { renderHook } from '@testing-library/react';
 * import { createQueryClientWrapper } from '../../test/utils';
 * import { useAuth } from './useAuth';
 *
 * test('returns authenticated user', async () => {
 *   const { result } = renderHook(() => useAuth(), {
 *     wrapper: createQueryClientWrapper(),
 *   });
 *
 *   await waitFor(() => expect(result.current.isLoading).toBe(false));
 *   expect(result.current.user).toBeDefined();
 * });
 * ```
 */
export function createQueryClientWrapper() {
  const testQueryClient = createTestQueryClient();

  return function QueryClientWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
  };
}

/**
 * Standard wrapper for testing-library hooks that need QueryClient
 */
export function wrapper({ children }: { children: ReactNode }) {
  const testQueryClient = createTestQueryClient();
  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
}
