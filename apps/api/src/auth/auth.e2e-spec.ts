import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../app/app.module';
import { MailService } from '../mail/mail.service';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let capturedVerificationToken: string;
  const testEmail = `test-${Date.now()}@example.com`;

  // Mock MailService to prevent actual emails and capture the token
  const mailServiceMock = {
    send: jest.fn().mockImplementation((options) => {
      // Logic to extract token from the verification link URL in the 'html' option
      const match = options.html.match(/token=([a-fA-F0-9]+)/);
      if (match && match[1]) {
        capturedVerificationToken = match[1];
      }
      return Promise.resolve();
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user, send a verification email, and return a success message', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          name: 'Test User',
          password: 'password123',
        })
        .expect(201);

      // New expectation for the hard verification flow
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Registration successful. Please check your email to verify your account.'
      );
      expect(response.body).not.toHaveProperty('accessToken');
      expect(mailServiceMock.send).toHaveBeenCalledTimes(1);
      expect(capturedVerificationToken).toBeDefined();

      // No authToken is set here because login requires verification
    });

    it('should return 409 when registering with existing email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          name: 'Another User',
          password: 'password456',
        })
        .expect(409);

      expect(response.body.message).toBe('User with this email already exists');
      expect(response.body.statusCode).toBe(409);
    });

    it('should return 400 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'short@example.com',
          name: 'Short Pass User',
          password: '12345',
        })
        .expect(400);
    });
  });

  describe('Email Verification and Login Flow', () => {
    it('should fail to login before verification', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toBe('Email not verified. Please check your email inbox.');
        });
    });

    it('should successfully verify the user and return JWT token (auto-login)', async () => {
      expect(capturedVerificationToken).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({
          token: capturedVerificationToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(testEmail);

      authToken = response.body.accessToken;
    });

    it('should login with valid credentials and return JWT token after verification', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
      expect(response.body.statusCode).toBe(401);
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
      expect(response.body.statusCode).toBe(401);
    });
  });
});
