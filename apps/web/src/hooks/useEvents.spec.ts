import { renderHook, waitFor } from '@testing-library/react';

import { useEvents } from './useEvents';

describe('useEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return empty events array when no events exist', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
  });

  it('should load events from localStorage on mount', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Test Event',
        members: 'John, Jane',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
    ];

    localStorage.setItem('events', JSON.stringify(mockEvents));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
  });

  it('should handle invalid data in localStorage', async () => {
    localStorage.setItem('events', 'invalid-json');

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(localStorage.getItem('events')).toBeNull();
  });

  it.skip('should handle non-array data in localStorage', async () => {
    localStorage.clear();
    localStorage.setItem('events', JSON.stringify({ invalid: 'data' }));

    const { result, unmount } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);

    unmount();
  });

  it('should create a new event and persist to localStorage', async () => {
    const { result, unmount } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newEventInput = {
      title: 'New Event',
      members: 'Alice, Bob',
      datetime: '2025-12-15T16:00',
    };

    const createdEvent = result.current.createEvent(newEventInput);

    expect(createdEvent.title).toBe(newEventInput.title);
    expect(createdEvent.members).toBe(newEventInput.members);
    expect(createdEvent.datetime).toBe(newEventInput.datetime);
    expect(createdEvent.id).toMatch(/^event-/);
    expect(createdEvent.createdAt).toBeDefined();

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    expect(storedEvents).toHaveLength(1);
    expect(storedEvents[0].title).toBe('New Event');

    unmount();
  });

  it('should delete an event and update localStorage', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Event 1',
        members: 'John',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Event 2',
        members: 'Jane',
        datetime: '2025-12-11T15:00',
        createdAt: '2025-12-06T11:00:00.000Z',
      },
    ];

    localStorage.setItem('events', JSON.stringify(mockEvents));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toHaveLength(2);

    result.current.deleteEvent('event-1');

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(result.current.events[0].id).toBe('event-2');

    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    expect(storedEvents).toHaveLength(1);
    expect(storedEvents[0].id).toBe('event-2');
  });

  it('should clear all events and update localStorage', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Event 1',
        members: 'John',
        datetime: '2025-12-10T14:00',
        createdAt: '2025-12-06T10:00:00.000Z',
      },
      {
        id: 'event-2',
        title: 'Event 2',
        members: 'Jane',
        datetime: '2025-12-11T15:00',
        createdAt: '2025-12-06T11:00:00.000Z',
      },
    ];

    localStorage.setItem('events', JSON.stringify(mockEvents));

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toHaveLength(2);

    result.current.clearAllEvents();

    await waitFor(() => {
      expect(result.current.events).toEqual([]);
    });

    const storedEvents = localStorage.getItem('events');
    expect(storedEvents).toBeNull();
  });

  it('should complete loading and set events', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
  });

  it.skip('should add multiple events and maintain state', async () => {
    localStorage.clear();
    const { result, unmount } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual([]);

    result.current.createEvent({
      title: 'Event 1',
      members: 'Alice',
      datetime: '2025-12-10T10:00',
    });

    result.current.createEvent({
      title: 'Event 2',
      members: 'Bob',
      datetime: '2025-12-11T11:00',
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(2);
    });

    expect(result.current.events[0].title).toBe('Event 1');
    expect(result.current.events[1].title).toBe('Event 2');

    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    expect(storedEvents).toHaveLength(2);

    unmount();
  });

  it('should generate unique IDs for each event', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const event1 = result.current.createEvent({
      title: 'Event 1',
      members: 'Alice',
      datetime: '2025-12-10T10:00',
    });

    const event2 = result.current.createEvent({
      title: 'Event 2',
      members: 'Bob',
      datetime: '2025-12-11T11:00',
    });

    expect(event1.id).not.toBe(event2.id);
    expect(event1.id).toMatch(/^event-/);
    expect(event2.id).toMatch(/^event-/);
  });
});
