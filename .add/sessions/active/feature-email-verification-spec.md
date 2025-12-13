# Session: Email Verification Feature

**Status**: ✅ COMPLETE
**Started**: 2025-12-12
**Completed**: 2025-12-12
**Goal**: Design and implement email verification feature.

## 1. Overview

Implement a secure email verification flow using a "Hard Verification" strategy. Users must verify their email address before they can log in.

- **Provider**: Ethereal Email (for development/testing).
- **Token Policy**: 8-hour expiration.

## 2. Database Schema Changes (`apps/api/prisma/schema.prisma`)

Modify the `User` model to track verification status and temporary tokens.

```prisma
model User {
  // ... existing fields
  isEmailVerified       Boolean   @default(false)
  verificationToken     String?   @unique
  verificationTokenExp  DateTime? // Expiration time (8 hours)
}
```

## 3. API Changes (`apps/api/src/auth/`)

### 3.1 Pseudocode Implementation Plan

#### Registration Flow (`auth.service.ts -> register`)

```typescript
async function register(dto: RegisterDto) {
  // 1. Check existence
  if (await prisma.user.findUnique({ where: { email: dto.email } })) {
    throw new ConflictException('User exists');
  }

  // 2. Create User (Unverified)
  const user = await prisma.user.create({
    data: { ...dto, isEmailVerified: false },
  });

  // 3. Generate & Save Token
  const token = uuid(); // or crypto.randomBytes
  const expiration = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: token, verificationTokenExp: expiration },
  });

  // 4. Send Email (Ethereal)
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await mailService.send({
    to: user.email,
    subject: 'Verify your email',
    text: `Click here: ${link}`,
  });

  // 5. Return Message (No JWT)
  return { message: 'Registration successful. Please check your email.' };
}
```

#### Verification Flow (`auth.service.ts -> verifyEmail`)

```typescript
async function verifyEmail(token: string) {
  // 1. Find User by Token
  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  // 2. Validate Token
  if (!user || user.verificationTokenExp < new Date()) {
    throw new BadRequestException('Invalid or expired token');
  }

  // 3. Update User
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExp: null,
    },
  });

  // 4. Login User (Generate JWT)
  return this.generateAuthResponse(updatedUser);
}
```

#### Login Flow Update (`auth.service.ts -> login`)

```typescript
async function login(dto: LoginDto) {
  const user = await validateCredentials(dto);

  // Guard: Hard Verification
  if (!user.isEmailVerified) {
    throw new ForbiddenException('Email not verified');
  }

  return this.generateAuthResponse(user);
}
```

### 3.2 Dependencies

- `nodemailer`
- `@types/nodemailer`

### 3.3 Environment Variables

```bash
# Ethereal Email Credentials
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=generated_ethereal_user
SMTP_PASS=generated_ethereal_pass
FRONTEND_URL=http://localhost:3000
```

## 4. Frontend Changes (`apps/web/`)

### 4.1 Pages

- **`src/app/register/page.tsx`**: Update to show success message instead of auto-redirecting.
- **`src/app/login/page.tsx`**: Catch 403 error and show "Email not verified" alert.
- **`src/app/verify-email/page.tsx`**: New page that captures `?token=...` from URL and calls API.

### 4.2 API Client

- Regenerate Orval client to match new API signatures.

## 5. Implementation Summary

All steps completed ✅

1. ✅ **Backend**: Installed nodemailer & @types/nodemailer
2. ✅ **Backend**: Ethereal Email credentials generated and configured
3. ✅ **Backend**: Schema changes & migration applied
4. ✅ **Backend**: MailService implemented (apps/api/src/mail/)
5. ✅ **Backend**: AuthService updated with verification logic
6. ✅ **Backend**: AuthController has POST /api/auth/verify-email
7. ✅ **Frontend**: Verify page created (apps/web/src/app/verify-email/)
8. ✅ **Frontend**: Register page shows "check email" message
9. ✅ **Frontend**: Login page shows "email not verified" error
10. ✅ **Tested**: Registration, verification, and login flow verified working

## 6. Blockers Resolved

- **Database password mismatch**: .env had wrong password, fixed to match docker-compose.yml
- **Missing SMTP config**: Added Ethereal Email credentials to .env

## 7. Files Created

- `apps/api/src/mail/mail.module.ts`
- `apps/api/src/mail/mail.service.ts`
- `apps/api/src/auth/dto/verify-email.dto.ts`
- `apps/web/src/app/verify-email/page.tsx`
- `apps/web/src/app/verify-email/verify-email.module.css`

## 8. Files Modified

- `apps/api/prisma/schema.prisma` - Added verification fields
- `apps/api/src/auth/auth.service.ts` - Added verification logic
- `apps/api/src/auth/auth.controller.ts` - Added verify-email endpoint
- `apps/api/src/auth/auth.module.ts` - Added MailModule import
- `apps/api/src/app/app.module.ts` - Added MailModule
- `apps/api/.env` - Added SMTP config
- `apps/api/.env.example` - Added SMTP config template
- `apps/web/src/app/register/page.tsx` - Show success message
- `apps/web/src/app/login/page.tsx` - Show verification error

## 9. Documentation Updated

- ADR-020: Email Verification Strategy
- TASKS.md: Phase 4 with email verification complete
- BLOCKERS.md: Resolved blockers documented
- auth.md: Email verification patterns added
- README.md: Phase 4 status updated
