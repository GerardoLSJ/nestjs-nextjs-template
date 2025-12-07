'use client';

import { useEffect, useState } from 'react';

import type { CreateEventInput, Event } from '../types/event.types';

const API_BASE_URL = 'http://localhost:3333/api';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  const fetchEvents = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (input: CreateEventInput): Promise<Event> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Convert datetime to ISO 8601 format if it's in YYYY-MM-DDTHH:MM format
    const eventData = {
      ...input,
      datetime:
        input.datetime.includes('Z') || input.datetime.includes('+')
          ? input.datetime
          : new Date(input.datetime).toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    const newEvent = await response.json();
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const deleteEvent = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }

    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const clearAllEvents = () => {
    setEvents([]);
  };

  return {
    events,
    isLoading,
    error,
    createEvent,
    deleteEvent,
    clearAllEvents,
    refetch: fetchEvents,
  };
}
