'use client';

import styles from './page.module.css';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { EventForm } from '../components/events/EventForm';
import { EventList } from '../components/events/EventList';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';

export default function Index() {
  const { user } = useAuth();
  const { events, isLoading, createEvent, deleteEvent } = useEvents();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome, {user?.name}!</h1>
          <p className={styles.subtitle}>Plan your events</p>
        </div>

        <EventForm onSubmit={createEvent} />
        <EventList events={events} onDelete={deleteEvent} />
      </div>
    </ProtectedRoute>
  );
}
