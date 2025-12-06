'use client';

import { useState } from 'react';

import styles from './EventForm.module.css';
import type { CreateEventInput } from '../../types/event.types';

interface EventFormProps {
  onSubmit: (input: CreateEventInput) => void;
}

export function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      members,
      dateTime,
    });

    // Reset form
    setTitle('');
    setMembers('');
    setDateTime('');
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
        <label htmlFor="dateTime" className={styles.label}>
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="dateTime"
          className={styles.input}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Create Event
      </button>
    </form>
  );
}
