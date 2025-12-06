'use client';

import styles from './EventList.module.css';
import type { Event } from '../../types/event.types';

interface EventListProps {
  events: Event[];
  onDelete: (id: string) => void;
}

export function EventList({ events, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No events yet. Create your first event!</p>
      </div>
    );
  }

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return 'No date set';

    try {
      const date = new Date(dateTimeStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateTimeStr;
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (_error) {
      return dateTimeStr;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Events</h2>
      <div className={styles.list}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <button
                onClick={() => onDelete(event.id)}
                className={styles.deleteButton}
                aria-label="Delete event"
              >
                ✕
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.detail}>
                <span className={styles.icon}>📅</span>
                <span className={styles.detailText}>{formatDateTime(event.dateTime)}</span>
              </div>

              {event.members && (
                <div className={styles.detail}>
                  <span className={styles.icon}>👥</span>
                  <span className={styles.detailText}>{event.members}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
