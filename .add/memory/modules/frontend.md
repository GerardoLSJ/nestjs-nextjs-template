# Frontend Context

> **Tokens**: ~1400 | **Triggers**: frontend, react, nextjs, component, hook, ui, styling, css, layout

## Overview

Frontend built with Next.js 14+ using App Router, React 18+, TypeScript strict mode, and CSS Modules for styling.

## Key Files

- `apps/web/src/app/` - Next.js pages and layouts (App Router)
- `apps/web/src/components/` - Reusable React components
- `apps/web/src/hooks/` - Custom React hooks
- `apps/web/src/lib/` - Utility functions and API client

## Patterns

### React Hooks Pattern

**Custom Hook Structure**:

```typescript
export function useCustomHook() {
  const [state, setState] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage or API
    try {
      // Load data
    } catch (error) {
      // Handle errors gracefully
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = (input: CreateInput): Item => {
    // Create logic
    // Update state
    // Persist to storage
    return newItem;
  };

  return { state, isLoading, createItem };
}
```

**Key Points**:
- Always include loading state for async operations
- Use try-catch-finally for error handling
- Return consistent interface (state + methods)
- Follow existing patterns (useAuth → useEvents)

### Component Testing Patterns

**Basic Test Structure**:

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      render(<Component />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });
});
```

**User Interaction Testing**:

```typescript
const user = userEvent.setup();
const button = screen.getByRole('button', { name: /submit/i });
await user.click(button);
await waitFor(() => {
  expect(mockCallback).toHaveBeenCalled();
});
```

**Key Points**:
- Use React Testing Library (not Enzyme)
- Test user behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Group related tests with describe()
- Use userEvent for interactions (not fireEvent)
- Use waitFor for async assertions

### CSS Modules Patterns

**File Naming**: `ComponentName.module.css`

**Usage Pattern**:

```typescript
import styles from './ComponentName.module.css';

export function ComponentName() {
  return <div className={styles.container}>...</div>;
}
```

**Key Points**:
- Scoped styles prevent conflicts
- Use camelCase for class names (styles.cardHeader)
- Co-locate CSS file with component
- Follow existing naming conventions

### Form Handling Pattern

**Controlled Form with Reset**:

```typescript
const [value, setValue] = useState('');

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit({ value });
  setValue(''); // Reset after submission
};

return (
  <form onSubmit={handleSubmit}>
    <input value={value} onChange={(e) => setValue(e.target.value)} required />
    <button type="submit">Submit</button>
  </form>
);
```

**Key Points**:
- Use HTML5 validation (required, type="email")
- Reset form state after successful submission
- Prevent default on form submit
- Use controlled components (value + onChange)

### localStorage Patterns

**Safe JSON Parsing**:

```typescript
try {
  const stored = localStorage.getItem(key);
  if (stored) {
    const parsed = JSON.parse(stored);
    setState(Array.isArray(parsed) ? parsed : []);
  }
} catch (_error) {
  localStorage.removeItem(key); // Clean up invalid data
  setState([]);
}
```

**Key Points**:
- Always wrap JSON.parse in try-catch
- Validate parsed data type (Array.isArray, typeof)
- Clean up invalid data (remove from localStorage)
- Prefix error variables with underscore if unused

## Common Operations

### Creating a New Component

1. Create `ComponentName.tsx` with 'use client' if interactive
2. Create `ComponentName.module.css` for styles
3. Export from `index.ts` in component directory
4. Create `ComponentName.spec.tsx` for tests

### Creating a Custom Hook

1. Create `use<HookName>.ts` file
2. Follow pattern: state + loading + operations
3. Handle errors gracefully
4. Create `use<HookName>.spec.ts` with renderHook tests

## Gotchas

### Next.js 16 App Router

**Problem**: Client components must have 'use client' directive

**Solution**: Add at top of file for components using hooks or browser APIs

```typescript
'use client';

import { useState } from 'react';
// ... rest of component
```

**Key Points**:
- Required for useState, useEffect, useRouter
- Required for browser APIs (localStorage, window, etc.)
- Not required for server components
- Place at very top of file

### localStorage Test Isolation

**Problem**: localStorage state can bleed between tests

**Solution**:
1. Add `localStorage.clear()` in beforeEach and afterEach
2. Call `unmount()` after tests that modify state
3. If problems persist, pragmatically skip tests with `.skip()`

```typescript
describe('useHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should work', async () => {
    const { result, unmount } = renderHook(() => useHook());
    // ... test logic
    unmount(); // Clean up
  });
});
```

### Date Handling

**Problem**: `new Date('invalid-date')` creates Invalid Date object without throwing

**Solution**: Use `isNaN(date.getTime())` to detect invalid dates

```typescript
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return 'No date set';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Return original string for invalid dates
    }
    return date.toLocaleString('en-US', {
      /* format options */
    });
  } catch (_error) {
    return dateStr;
  }
};
```

### TanStack Query

**SSR Setup**: Separate client instances

```typescript
// Server Component
const queryClient = new QueryClient();

// Client Component
('use client');
const [queryClient] = useState(() => new QueryClient());
```

**Query Pattern**:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
});
```

## Related

- [API Module](api.md) - Backend REST API
- [Testing Module](testing.md) - Test patterns and MSW
- [Events Module](events.md) - Event planner feature
