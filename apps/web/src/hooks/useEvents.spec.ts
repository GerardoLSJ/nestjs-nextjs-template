import { renderHook, waitFor } from '@testing-library/react';

import { useEvents } from './useEvents';
import { resetMockEvents } from '../test/mocks/handlers';

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
});

describe('useEvents', () => {
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
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch events from API on mount', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Initially empty since we haven't created any events
    expect(result.current.events).toEqual([]);
  });

  it('should handle unauthenticated state', async () => {
    mockLocalStorage.removeItem('accessToken');

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Not authenticated');
    expect(result.current.events).toEqual([]);
  });

  it('should create a new event via API', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newEventInput = {
      title: 'New Event',
      members: 'Alice, Bob',
      datetime: '2025-12-15T16:00:00Z',
    };

    let createdEvent;
    await waitFor(async () => {
      createdEvent = await result.current.createEvent(newEventInput);
    });

    expect(createdEvent).toBeDefined();
    expect(createdEvent!.title).toBe(newEventInput.title);
    expect(createdEvent!.members).toBe(newEventInput.members);
    expect(createdEvent!.id).toMatch(/^event-/);

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });
  });

  it('should delete an event via API', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create an event first
    await waitFor(async () => {
      await result.current.createEvent({
        title: 'Event to Delete',
        members: 'John',
        datetime: '2025-12-10T14:00:00Z',
      });
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    const eventId = result.current.events[0].id;

    // Delete the event
    await waitFor(async () => {
      await result.current.deleteEvent(eventId);
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(0);
    });
  });

  it('should clear all events from state', async () => {
    const { result } = renderHook(() => useEvents());

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

    await waitFor(() => {
      expect(result.current.events).toEqual([]);
    });
  });

  it('should handle API errors when creating events', async () => {
    mockLocalStorage.removeItem('accessToken');

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.createEvent({
        title: 'Test Event',
        members: 'John',
        datetime: '2025-12-10T10:00:00Z',
      })
    ).rejects.toThrow('Not authenticated');
  });

  it('should handle API errors when deleting events', async () => {
    mockLocalStorage.removeItem('accessToken');

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(result.current.deleteEvent('event-1')).rejects.toThrow('Not authenticated');
  });
});
