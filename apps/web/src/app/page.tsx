'use client';

import { useState } from 'react';

import styles from './page.module.css';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { CalendarPicker } from '../components/calendar/CalendarPicker';
import { EventForm } from '../components/events/EventForm';
import { EventList } from '../components/events/EventList';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';

// Helper function to format date to YYYY-MM-DDTHH:MM (datetime-local format)
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function Index() {
  const { user } = useAuth();
  const { events, isLoading, createEvent, deleteEvent } = useEvents();

  // Initialize date to today's date at 12:00
  const initialDate = new Date();
  initialDate.setHours(12, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [dateTime, setDateTime] = useState<string>(formatDateTimeLocal(initialDate));

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Preserve existing time part when selecting a new date
    const timePart = dateTime.split('T')[1] || '12:00';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    setDateTime(`${year}-${month}-${day}T${timePart}`);
  };

  const handleDateTimeChange = (value: string) => {
    setDateTime(value);

    // Update selectedDate if date part changes (optional, but keeps state synced)
    const datePart = value.split('T')[0];
    if (datePart) {
      const parts = datePart.split('-').map(Number);
      // Create date object from new date part, preserving time part if available
      const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
      setSelectedDate(newDate);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const handleCreateEvent = (input: Parameters<typeof createEvent>[0]) => {
    createEvent(input);

    // Reset date/time to today at 12:00 after submission (UX improvement)
    const resetDate = new Date();
    resetDate.setHours(12, 0, 0, 0);
    setDateTime(formatDateTimeLocal(resetDate));
    setSelectedDate(resetDate);
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome, {user?.name}!</h1>
          <p className={styles.subtitle}>Plan your events</p>
        </div>

        <div className={styles.eventCreator}>
          <CalendarPicker value={selectedDate} onChange={handleDateChange} />
          <EventForm
            onSubmit={handleCreateEvent}
            dateTime={dateTime}
            onDateTimeChange={handleDateTimeChange}
          />
        </div>

        <EventList events={events} onDelete={deleteEvent} />
      </div>
    </ProtectedRoute>
  );
}
