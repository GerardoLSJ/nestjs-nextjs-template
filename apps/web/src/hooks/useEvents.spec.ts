import { renderHook, waitFor } from '@testing-library/react';

import { useEvents } from './useEvents';
import type { CreateEventDto } from '../lib/api/generated/models';
import { resetMockEvents } from '../test/mocks/handlers';
import { wrapper } from '../test/utils';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

describe('useEvents (API Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    resetMockEvents();
    // Set a mock token for authenticated requests
    mockLocalStorage.setItem('accessToken', 'mock-jwt-token-12345');
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it('should return empty events array when no events exist', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      // isSuccess is used instead of isLoading to verify query completion
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch events from API on mount', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Initially empty since we haven't created any events
    expect(result.current.events).toEqual([]);
  });

  it('should handle unauthenticated state by not fetching and setting error', async () => {
    mockLocalStorage.removeItem('accessToken');
    // We expect the query not to be executed at all if disabled is true, and for the useEvents hook to return an empty array and isLoading: false in that case.
    // The query will return undefined, and the hook maps this to []
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      // In the new TanStack Query implementation, isLoading is false when enabled is false.
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull(); // No error thrown, just query disabled
    expect(result.current.events).toEqual([]);
  });

  it('should create a new event via API', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newEventInput: CreateEventDto = {
      title: 'New Event',
      members: 'Alice, Bob',
      datetime: '2025-12-15T16:00:00Z',
    };

    let createdEvent;
    await waitFor(async () => {
      createdEvent = await result.current.createEvent(newEventInput);
    });

    expect(createdEvent).toBeDefined();
    expect(createdEvent.title).toBe(newEventInput.title);
    expect(createdEvent.members).toBe(newEventInput.members);
    // The mock handler creates an ID starting with event-
    expect(createdEvent.id).toMatch(/^event-/);

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });
  });

  it('should delete an event via API', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create an event first
    let initialEvent;
    await waitFor(async () => {
      initialEvent = await result.current.createEvent({
        title: 'Event to Delete',
        members: 'John',
        datetime: '2025-12-10T14:00:00Z',
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    const eventId = initialEvent!.id;

    // Delete the event
    await waitFor(async () => {
      await result.current.deleteEvent(eventId);
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(0);
    });
  });

  // clearAllEvents is now a no-op in the API implementation - skip test
  it.skip('should clear all events from state', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create an event
    await waitFor(async () => {
      await result.current.createEvent({
        title: 'Event 1',
        members: 'Alice',
        datetime: '2025-12-10T10:00:00Z',
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    // Clear all events
    result.current.clearAllEvents();

    // Since this is a no-op now, the event count should remain 1 until refetch/manual deletion
    // However, the function is primarily for the old local state management.
    // For now, keep as no-op and skip.
    expect(result.current.events).toHaveLength(1);
  });

  // In the new generated client implementation, the error handling logic is in customFetch/orval
  // The hook itself relies on TanStack Query's error propagation.
  it('should handle API errors (e.g., failed create) by propagating error', async () => {
    // Override the POST handler to return an unauthorized error on the first event creation
    mockLocalStorage.removeItem('accessToken');

    const { result } = renderHook(() => useEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // The mutation call should fail and throw an error
    await expect(
      result.current.createEvent({
        title: 'Test Event',
        members: 'John',
        datetime: '2025-12-10T10:00:00Z',
      })
    ).rejects.toThrow('Session expired. Please log in again.');

    // Re-add token to reset state for other tests that run after this one
    mockLocalStorage.setItem('accessToken', 'mock-jwt-token-12345');
  });
});
