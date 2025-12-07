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

// Helper function to register a test user
async function registerTestUser(app: INestApplication, email: string, name: string) {
  const response = await request(app.getHttpServer()).post('/api/auth/register').send({
    email,
    name,
    password: 'password123',
  });

  return {
    token: response.body.accessToken,
    userId: response.body.user.id,
  };
}

/* eslint-disable max-lines-per-function */
describe('Events E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let otherUserToken: string;
  let eventId: string;
  const testEmail = `event-test-${Date.now()}@example.com`;
  const otherEmail = `event-other-${Date.now()}@example.com`;

  beforeAll(async () => {
    app = await setupTestApp();

    // Register and login primary test user
    const primaryUser = await registerTestUser(app, testEmail, 'Event Test User');
    authToken = primaryUser.token;
    userId = primaryUser.userId;

    // Register and login second user for ownership tests
    const otherUser = await registerTestUser(app, otherEmail, 'Other Test User');
    otherUserToken = otherUser.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/events', () => {
    it('should create a new event with valid JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Team Meeting',
          members: 'John, Jane, Bob',
          datetime: '2025-12-20T10:00:00Z',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Team Meeting');
      expect(response.body.members).toBe('John, Jane, Bob');
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      eventId = response.body.id;
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .send({
          title: 'Unauthorized Event',
          members: 'Nobody',
          datetime: '2025-12-20T10:00:00Z',
        })
        .expect(401);
    });

    it('should return 400 with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          members: '',
          datetime: 'invalid-date',
        })
        .expect(400);
    });
  });

  describe('GET /api/events', () => {
    it('should return all events for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0].userId).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/api/events').expect(401);
    });

    it('should return only user-specific events', async () => {
      // Create event for other user
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          title: 'Other User Event',
          members: 'Alice',
          datetime: '2025-12-21T10:00:00Z',
        });

      // Get events for first user
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should only contain events for first user
      const allEventsOwnedByUser = response.body.every(
        (event: { userId: string }) => event.userId === userId
      );
      expect(allEventsOwnedByUser).toBe(true);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a single event by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.title).toBe('Team Meeting');
      expect(response.body.userId).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get(`/api/events/${eventId}`).expect(401);
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .get('/api/events/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it("should return 403 when accessing another user's event", async () => {
      await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/events/:id', () => {
    it('should update an event', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Team Meeting',
        })
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.title).toBe('Updated Team Meeting');
      expect(response.body.members).toBe('John, Jane, Bob');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .send({
          title: 'Unauthorized Update',
        })
        .expect(401);
    });

    it("should return 403 when updating another user's event", async () => {
      await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          title: 'Forbidden Update',
        })
        .expect(403);
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .patch('/api/events/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Update Non-existent',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).delete(`/api/events/${eventId}`).expect(401);
    });

    it("should return 403 when deleting another user's event", async () => {
      await request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(403);
    });

    it('should delete an event', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Event successfully deleted');

      // Verify event is deleted
      await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .delete('/api/events/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
/* eslint-enable max-lines-per-function */
