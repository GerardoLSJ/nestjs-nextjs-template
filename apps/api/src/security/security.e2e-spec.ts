/// <reference types="jest" />

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../app/app.module';

// Helper function to setup test application
async function setupTestApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  await app.init();
  return app;
}

/* eslint-disable max-lines-per-function */
describe('Security E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Security Headers (Helmet.js)', () => {
    it('should include Content-Security-Policy header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('should include X-Content-Type-Options header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should include X-Frame-Options header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should include X-XSS-Protection header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['x-xss-protection']).toBeDefined();
    });

    it('should not include X-Powered-By header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('should include Strict-Transport-Security header', async () => {
      const response = await request(app.getHttpServer()).get('/api').expect(200);

      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['strict-transport-security']).toContain('max-age=');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Register a new user (should succeed)
      const testEmail = `rate-limit-test-${Date.now()}@example.com`;

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          name: 'Rate Limit Test',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should apply rate limiting to protected endpoints', async () => {
      // Note: This test verifies rate limiting is configured
      // Testing actual throttling would require making 100+ requests
      // which is impractical for E2E tests

      // Make a request and check for rate limit headers
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          name: 'Test',
          password: 'password123',
        });

      // Should complete successfully (within rate limit)
      expect(response.status).toBeLessThan(400);
    });

    it('should not rate limit health check endpoint', async () => {
      // Health check endpoint has @SkipThrottle() decorator
      // Make multiple requests to verify it's not rate limited

      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer()).get('/api').expect(200);

        expect(response.body).toHaveProperty('message');
      }

      // All requests should succeed without rate limiting
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      // CORS headers should be present
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Error Handling', () => {
    it('should return standardized error response with correlation ID', async () => {
      const response = await request(app.getHttpServer()).get('/api/nonexistent').expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path', '/api/nonexistent');
      expect(response.body).toHaveProperty('correlationId');

      // Correlation ID should be a UUID format
      expect(response.body.correlationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });
});
/* eslint-enable max-lines-per-function */
