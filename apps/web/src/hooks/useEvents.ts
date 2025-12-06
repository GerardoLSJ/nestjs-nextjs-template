'use client';

import { useEffect, useState } from 'react';

import type { CreateEventInput, Event } from '../types/event.types';

const EVENTS_STORAGE_KEY = 'events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load events from localStorage on mount
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        setEvents(Array.isArray(parsed) ? parsed : []);
      }
    } catch (_error) {
      // Invalid data, reset to empty array
      localStorage.removeItem(EVENTS_STORAGE_KEY);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = (input: CreateEventInput): Event => {
    const newEvent: Event = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: input.title,
      members: input.members,
      dateTime: input.dateTime,
      createdAt: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));

    return newEvent;
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const clearAllEvents = () => {
    setEvents([]);
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  return {
    events,
    isLoading,
    createEvent,
    deleteEvent,
    clearAllEvents,
  };
}
