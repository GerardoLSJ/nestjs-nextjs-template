/**
 * Standardized error response format for all API errors
 *
 * @example
 * {
 *   statusCode: 400,
 *   message: 'Validation failed',
 *   error: 'Bad Request',
 *   errors: [
 *     { field: 'email', message: 'Invalid email format' }
 *   ],
 *   timestamp: '2025-12-07T10:30:00.000Z',
 *   path: '/api/auth/register',
 *   correlationId: 'abc-123-def-456'
 * }
 */
export interface ErrorResponse {
  /** HTTP status code */
  statusCode: number;

  /** Human-readable error message */
  message: string | string[];

  /** Error type/name (e.g., 'Bad Request', 'Unauthorized') */
  error: string;

  /** Detailed validation errors (for 400 Bad Request) */
  errors?: ValidationError[];

  /** ISO 8601 timestamp of when the error occurred */
  timestamp: string;

  /** Request path that generated the error */
  path: string;

  /** Unique correlation ID for tracking (optional) */
  correlationId?: string;

  /** Stack trace (only in development mode) */
  stack?: string;
}

/**
 * Validation error detail for field-level errors
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;

  /** Validation error message */
  message: string;

  /** Constraints that failed (optional) */
  constraints?: Record<string, string>;
}
