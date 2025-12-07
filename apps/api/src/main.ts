/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('[DEBUG] ----------------------------------------------------------------');
  console.log('[DEBUG] Bootstrap started at:', new Date().toISOString());
  console.log('[DEBUG] Process ID:', process.pid);
  console.log('[DEBUG] Parent Process ID:', process.ppid);
  console.log('[DEBUG] Working directory:', process.cwd());
  console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
  console.log('[DEBUG] Arguments:', process.argv.join(' '));
  console.log('[DEBUG] ----------------------------------------------------------------');

  // Log stack trace to identify who called bootstrap (helpful if it's being called unexpectedly)
  try {
    throw new Error('Stack Trace Check');
  } catch (e: any) {
    console.log('[DEBUG] Stack trace check:', e.stack.split('\n')[1].trim());
  }

  console.log('[DEBUG] Creating NestFactory...');
  let app;
  try {
    app = await NestFactory.create(AppModule);
    console.log('[DEBUG] NestFactory created successfully');
  } catch (error) {
    console.error('[DEBUG] ERROR creating NestFactory:', error);
    throw error;
  }

  // Security: Add Helmet for security headers
  // Helmet helps secure Express/NestJS apps by setting various HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      // HSTS (HTTP Strict-Transport-Security)
      // Forces HTTPS for future requests
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      // Prevent MIME type sniffing
      noSniff: true,
      // Disable X-Powered-By header
      hidePoweredBy: true,
      // XSS Protection
      xssFilter: true,
      // Clickjacking protection
      frameguard: {
        action: 'deny',
      },
    })
  );

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  console.log('[DEBUG] Global prefix set to:', globalPrefix);

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Note: ThrottlerGuard is applied globally via APP_GUARD provider in app.module.ts
  // This ensures proper dependency injection and rate limiting configuration

  // Global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    })
  );

  // Swagger/OpenAPI documentation setup
  const config = new DocumentBuilder()
    .setTitle('Auth Tutorial API')
    .setDescription(
      'API documentation for the auth-tutorial project. This is a comprehensive REST API built with NestJS.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('events', 'Event management endpoints')
    .addTag('app', 'Application endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  // Expose OpenAPI JSON for code generation
  app.getHttpAdapter().get(`/${globalPrefix}/docs-json`, (_req, res) => {
    res.json(document);
  });

  const port = process.env.PORT || 3333;
  console.log('[DEBUG] About to listen on port:', port);

  try {
    await app.listen(port);
    console.log('[DEBUG] Successfully listening on port:', port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`📚 API Documentation available at: http://localhost:${port}/${globalPrefix}/docs`);
  } catch (error) {
    console.error('[DEBUG] ERROR listening on port:', error);
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('[DEBUG] FATAL ERROR in bootstrap:', error);
  process.exit(1);
});
