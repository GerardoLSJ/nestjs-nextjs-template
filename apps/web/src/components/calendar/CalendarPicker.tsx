'use client';

import { useState, useMemo } from 'react';

import styles from './CalendarPicker.module.css';

interface CalendarPickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function CalendarPicker({ value, onChange, minDate, maxDate }: CalendarPickerProps) {
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value.getFullYear(), value.getMonth(), 1);
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysCount; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [viewDate]);

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true;
    }
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) {
      return true;
    }
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    return (
      date.getFullYear() === value.getFullYear() &&
      date.getMonth() === value.getMonth() &&
      date.getDate() === value.getDate()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange(date);
    }
  };

  return (
    <div className={styles.calendar} role="application" aria-label="Calendar">
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ←
        </button>
        <span className={styles.monthYear}>
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className={styles.weekDays} role="row">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className={styles.weekDay} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid} role="grid">
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className={styles.emptyDay} />;
          }

          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`${styles.day} ${selected ? styles.selected : ''} ${
                today ? styles.today : ''
              } ${disabled ? styles.disabled : ''}`}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              aria-pressed={selected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
