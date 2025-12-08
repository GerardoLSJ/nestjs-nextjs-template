'use client';

import {
  useEventsControllerCreate,
  useEventsControllerFindAll,
  useEventsControllerRemove,
} from '../lib/api/generated/events/events';
import type { CreateEventDto } from '../lib/api/generated/models';
import type { Event } from '../types/event.types';

export function useEvents() {
  const {
    data: rawEvents,
    isLoading,
    error,
    refetch,
  } = useEventsControllerFindAll({
    query: {
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    },
  });

  // Cast the response to Event[] - Orval generates incorrect void type
  const events = (Array.isArray(rawEvents) ? rawEvents : []) as Event[];

  const { mutateAsync: createMutation } = useEventsControllerCreate();
  const { mutateAsync: deleteMutation } = useEventsControllerRemove();

  const createEvent = async (input: CreateEventDto) => {
    // Convert datetime to ISO 8601 format if it's in YYYY-MM-DDTHH:MM format
    const eventData = {
      ...input,
      datetime:
        input.datetime.includes('Z') || input.datetime.includes('+')
          ? input.datetime
          : new Date(input.datetime).toISOString(),
    };

    const newEvent = await createMutation({ data: eventData });
    await refetch();
    return newEvent;
  };

  const deleteEvent = async (id: string) => {
    await deleteMutation({ id });
    await refetch();
  };

  const clearAllEvents = () => {
    // No-op for API implementation, or could implement a bulk delete endpoint
  };

  return {
    events,
    isLoading,
    error: error ? (error as Error).message : null,
    createEvent,
    deleteEvent,
    clearAllEvents,
    refetch,
  };
}
