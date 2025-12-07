'use client';

import React from 'react';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  /**
   * Error message to display. Can be a string, Error object, or array of messages
   */
  error?: string | Error | string[] | null;

  /**
   * Optional title for the error message
   */
  title?: string;

  /**
   * Variant of the error message display
   * - 'alert': Full width alert box (default)
   * - 'inline': Inline error message
   * - 'toast': Toast-style notification
   */
  variant?: 'alert' | 'inline' | 'toast';

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Optional close button handler
   */
  onClose?: () => void;
}

/**
 * Reusable error message component for displaying errors inline.
 *
 * @example Basic usage
 * ```tsx
 * <ErrorMessage error="Failed to load data" />
 * ```
 *
 * @example With action
 * ```tsx
 * <ErrorMessage
 *   error="Failed to save"
 *   action={{ label: 'Retry', onClick: handleRetry }}
 * />
 * ```
 *
 * @example Inline variant
 * ```tsx
 * <ErrorMessage
 *   error={error}
 *   variant="inline"
 * />
 * ```
 */
export function ErrorMessage({
  error,
  title = 'Error',
  variant = 'alert',
  action,
  onClose,
}: ErrorMessageProps) {
  // Don't render if no error
  if (!error) {
    return null;
  }

  // Extract error message(s)
  const messages = extractMessages(error);

  if (messages.length === 0) {
    return null;
  }

  const containerClass = `${styles.container} ${styles[variant]}`;

  return (
    <div className={containerClass} role="alert">
      {/* Error Icon */}
      <div className={styles.icon}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Error Content */}
      <div className={styles.content}>
        {variant === 'alert' && <div className={styles.title}>{title}</div>}

        <div className={styles.messages}>
          {messages.length === 1 ? (
            <p className={styles.message}>{messages[0]}</p>
          ) : (
            <ul className={styles.messageList}>
              {messages.map((msg, index) => (
                <li key={index} className={styles.messageItem}>
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <button onClick={action.onClick} className={styles.actionButton}>
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <button onClick={onClose} className={styles.closeButton} aria-label="Close">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Extracts error messages from various error formats
 */
function extractMessages(error: string | Error | string[]): string[] {
  if (typeof error === 'string') {
    return [error];
  }

  if (Array.isArray(error)) {
    return error.filter((msg) => typeof msg === 'string' && msg.trim().length > 0);
  }

  if (error instanceof Error) {
    return [error.message || 'An unexpected error occurred'];
  }

  return ['An unexpected error occurred'];
}
