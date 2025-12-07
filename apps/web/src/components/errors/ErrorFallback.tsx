'use client';

import React, { ErrorInfo } from 'react';

import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset?: () => void;
}

/**
 * Default error fallback UI component displayed when an error is caught by ErrorBoundary.
 *
 * Features:
 * - User-friendly error message
 * - "Try Again" button to reset error boundary
 * - Technical details in development mode
 * - Mobile-responsive design
 */
export function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleReload = () => {
    if (onReset) {
      onReset();
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Error Icon */}
        <div className={styles.icon}>
          <svg
            width="64"
            height="64"
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

        {/* Error Message */}
        <h1 className={styles.title}>Oops! Something went wrong</h1>
        <p className={styles.message}>
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button onClick={handleReload} className={styles.primaryButton}>
            Try Again
          </button>
          <button onClick={() => (window.location.href = '/')} className={styles.secondaryButton}>
            Go Home
          </button>
        </div>

        {/* Technical Details (Development Only) */}
        {isDevelopment && error && (
          <details className={styles.details}>
            <summary className={styles.detailsSummary}>Technical Details (Dev Only)</summary>
            <div className={styles.detailsContent}>
              <div className={styles.errorSection}>
                <h3>Error Message:</h3>
                <pre className={styles.errorText}>{error.message}</pre>
              </div>

              {error.stack && (
                <div className={styles.errorSection}>
                  <h3>Stack Trace:</h3>
                  <pre className={styles.errorText}>{error.stack}</pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <div className={styles.errorSection}>
                  <h3>Component Stack:</h3>
                  <pre className={styles.errorText}>{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Help Text */}
        <p className={styles.helpText}>
          If the problem persists, please contact support or try again later.
        </p>
      </div>
    </div>
  );
}
