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
    if (!dateTimeStr) return { local: 'No date set', pdt: '', cst: '' };

    try {
      const date = new Date(dateTimeStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return { local: dateTimeStr, pdt: '', cst: '' };
      }

      const baseOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };

      const local = date.toLocaleString('en-US', baseOptions);

      // Format in PDT (America/Los_Angeles)
      const pdt = date.toLocaleString('en-US', {
        ...baseOptions,
        timeZone: 'America/Los_Angeles',
        timeZoneName: 'short',
      });

      // Format in CST (America/Chicago)
      const cst = date.toLocaleString('en-US', {
        ...baseOptions,
        timeZone: 'America/Chicago',
        timeZoneName: 'short',
      });

      return { local, pdt, cst };
    } catch (_error) {
      return { local: dateTimeStr, pdt: '', cst: '' };
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
                <div className={styles.detailText}>
                  {(() => {
                    const formatted = formatDateTime(event.datetime);
                    return (
                      <div className={styles.timeZones}>
                        <div className={styles.timeZoneRow}>
                          <span className={styles.timeZoneLabel}>PDT:</span>
                          <span>{formatted.pdt || formatted.local}</span>
                        </div>
                        <div className={styles.timeZoneRow}>
                          <span className={styles.timeZoneLabel}>CST:</span>
                          <span>{formatted.cst || formatted.local}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {event.members && (
                <div className={styles.detail}>
                  <span className={styles.icon}>👥</span>
                  <span className={styles.detailText}>{event.members}</span>
                </div>
              )}

              {event.messages && (
                <div className={styles.detail}>
                  <span className={styles.icon}>💬</span>
                  <span className={styles.detailText}>{event.messages}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
