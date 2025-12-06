'use client';

import { useState } from 'react';

import styles from './EventForm.module.css';
import type { CreateEventInput } from '../../types/event.types';

interface EventFormProps {
  onSubmit: (input: CreateEventInput) => void;
  dateTime: string; // Controlled by container (page.tsx)
  onDateTimeChange: (value: string) => void; // Used for standard input fallback/time input
}

export function EventForm({ onSubmit, dateTime, onDateTimeChange }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState('');
  // dateTime state is now controlled by props

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      members,
      dateTime,
    });

    // Reset form fields controlled by EventForm
    setTitle('');
    setMembers('');
    // Note: dateTime reset is now handled by the container/caller of onDateTimeChange
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Create New Event</h2>

      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Event Title
        </label>
        <input
          type="text"
          id="title"
          className={styles.input}
          placeholder="Team Meeting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="members" className={styles.label}>
          Members
        </label>
        <input
          type="text"
          id="members"
          className={styles.input}
          placeholder="John, Sarah, Mike"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
        />
      </div>

      {/* Keep the input for time selection, or fallback if calendar picker is not used */}
      <div className={styles.field}>
        <label htmlFor="dateTime" className={styles.label}>
          Time
        </label>
        <input
          type="time"
          id="dateTime"
          className={styles.input}
          // We only use time input here, date is selected via CalendarPicker in page.tsx
          value={dateTime.split('T')[1] || ''}
          onChange={(e) => {
            const datePart = dateTime.split('T')[0] || '';
            onDateTimeChange(`${datePart}T${e.target.value}`);
          }}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Create Event
      </button>
    </form>
  );
}
