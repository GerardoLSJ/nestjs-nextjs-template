'use client';

import {
  useEventsControllerCreate,
  useEventsControllerFindAll,
  useEventsControllerRemove,
} from '../lib/api/generated/events/events';
import type { CreateEventDto } from '../lib/api/generated/models';

export function useEvents() {
  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useEventsControllerFindAll({
    query: {
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    },
  });

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
    events: events || [],
    isLoading,
    error: error ? (error as Error).message : null,
    createEvent,
    deleteEvent,
    clearAllEvents,
    refetch,
  };
}
