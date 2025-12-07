import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { ErrorResponse, ValidationError } from '../interfaces/error-response.interface';

/**
 * Global exception filter that catches all HTTP exceptions and formats them
 * into a standardized error response structure.
 *
 * Features:
 * - Standardized error response format across all endpoints
 * - Correlation IDs for request tracking
 * - Detailed validation errors for 400 Bad Request
 * - Stack traces in development mode only
 * - Structured logging with context
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = this.getOrCreateCorrelationId(request);

    // Determine status code and error message
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    // Build standardized error response
    const errorResponse: ErrorResponse = this.buildErrorResponse(
      status,
      exceptionResponse,
      request,
      correlationId,
      exception
    );

    // Log the error with appropriate level
    this.logError(exception, request, correlationId, status);

    // Send response
    response.status(status).json(errorResponse);
  }

  /**
   * Builds a standardized error response object
   */
  private buildErrorResponse(
    status: number,
    exceptionResponse: string | object,
    request: Request,
    correlationId: string,
    exception: unknown
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;

    // Handle string response
    if (typeof exceptionResponse === 'string') {
      return {
        statusCode: status,
        message: exceptionResponse,
        error: this.getErrorName(status),
        timestamp,
        path,
        correlationId,
        ...(this.isDevelopment() && { stack: this.getStackTrace(exception) }),
      };
    }

    // Handle object response (NestJS format)
    const response = exceptionResponse as any;
    const message = response.message || response.error || 'An error occurred';

    // Extract validation errors if present
    const validationErrors = this.extractValidationErrors(response);

    return {
      statusCode: status,
      message,
      error: response.error || this.getErrorName(status),
      ...(validationErrors.length > 0 && { errors: validationErrors }),
      timestamp,
      path,
      correlationId,
      ...(this.isDevelopment() && { stack: this.getStackTrace(exception) }),
    };
  }

  /**
   * Extracts validation errors from class-validator format
   */
  private extractValidationErrors(response: any): ValidationError[] {
    if (!response.message || !Array.isArray(response.message)) {
      return [];
    }

    // class-validator returns an array of validation error objects
    return response.message
      .filter((item: any) => typeof item === 'object' && item.constraints)
      .map((item: any) => ({
        field: item.property,
        message: Object.values(item.constraints)[0] as string,
        constraints: item.constraints,
      }));
  }

  /**
   * Gets or creates a correlation ID for request tracking
   */
  private getOrCreateCorrelationId(request: Request): string {
    // Check if correlation ID already exists in request headers
    const existingId = request.headers['x-correlation-id'] || request.headers['x-request-id'];

    if (existingId && typeof existingId === 'string') {
      return existingId;
    }

    // Generate new correlation ID
    return uuidv4();
  }

  /**
   * Logs the error with appropriate context and severity level
   */
  private logError(
    exception: unknown,
    request: Request,
    correlationId: string,
    status: number
  ): void {
    const message = exception instanceof Error ? exception.message : 'Unknown error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    const logContext = {
      correlationId,
      method: request.method,
      url: request.url,
      statusCode: status,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    // Log errors (5xx) vs warnings (4xx)
    if (status >= 500) {
      this.logger.error(
        `[${correlationId}] ${request.method} ${request.url} - ${message}`,
        stack,
        JSON.stringify(logContext)
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${correlationId}] ${request.method} ${request.url} - ${message}`,
        JSON.stringify(logContext)
      );
    }
  }

  /**
   * Gets a human-readable error name for the status code
   */
  private getErrorName(status: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };

    return errorNames[status] || 'Error';
  }

  /**
   * Extracts stack trace from exception
   */
  private getStackTrace(exception: unknown): string | undefined {
    if (exception instanceof Error && exception.stack) {
      return exception.stack;
    }
    return undefined;
  }

  /**
   * Checks if running in development mode
   */
  private isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}
