'use client';

import { useState } from 'react';

import styles from './EventForm.module.css';
import type { CreateEventInput } from '../../types/event.types';

interface EventFormProps {
  onSubmit: (input: CreateEventInput) => void;
  datetime: string; // Controlled by container (page.tsx)
  onDatetimeChange: (value: string) => void; // Used for standard input fallback/time input
}

export function EventForm({ onSubmit, datetime, onDatetimeChange }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState('');
  const [messages, setMessages] = useState('');
  // datetime state is now controlled by props

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      members,
      messages,
      datetime,
    });

    // Reset form fields controlled by EventForm
    setTitle('');
    setMembers('');
    setMessages('');
    // Note: datetime reset is now handled by the container/caller of onDatetimeChange
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

      <div className={styles.field}>
        <label htmlFor="messages" className={styles.label}>
          Messages
        </label>
        <textarea
          id="messages"
          className={styles.textarea}
          placeholder="Add event details, agenda, or notes..."
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          required
          rows={3}
        />
      </div>

      {/* Keep the input for time selection, or fallback if calendar picker is not used */}
      <div className={styles.field}>
        <label htmlFor="datetime" className={styles.label}>
          Time
        </label>
        <input
          type="time"
          id="datetime"
          className={styles.input}
          // We only use time input here, date is selected via CalendarPicker in page.tsx
          value={datetime.split('T')[1] || ''}
          onChange={(e) => {
            const datePart = datetime.split('T')[0] || '';
            onDatetimeChange(`${datePart}T${e.target.value}`);
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
