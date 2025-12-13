# Authentication Context

<!-- @confidence: 0.90 -->
<!-- @verified: 2024-12-12 -->
<!-- @source: code-audit -->

> **Tokens**: ~1800 | **Triggers**: auth, login, logout, jwt, token, session, guard, passport, register, user, email, verification, verify

## Overview

JWT-based authentication using Passport.js on backend, localStorage-based session management on frontend. Secure password hashing with bcrypt. **Email verification required before login** (Hard Verification strategy).

## Key Files

**Backend**:

- `apps/api/src/auth/` - Authentication module
- `apps/api/src/auth/guards/` - JWT auth guards
- `apps/api/src/auth/strategies/` - Passport strategies
- `apps/api/src/auth/decorators/` - Custom decorators (@CurrentUser)
- `apps/api/src/mail/` - Email service (Nodemailer)

**Frontend**:

- `apps/web/src/hooks/useAuth.ts` - Authentication hook
- `apps/web/src/components/ProtectedRoute.tsx` - Route protection HOC
- `apps/web/src/app/verify-email/page.tsx` - Email verification page

## Patterns

### Backend Authentication (NestJS + Passport)

**JWT Strategy Configuration**:

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1d' },
  }),
  inject: [ConfigService],
});
```

**Custom Decorators**:

```typescript
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
```

**Using Guards**:

```typescript
@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getData(@CurrentUser() user: User) {
    return user;
  }
}
```

### Frontend Authentication

**useAuth Hook Pattern**:

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return { user, token, isLoading, isAuthenticated: !!token, login, logout };
}
```

**Protected Route HOC**:

```typescript
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    redirect('/login');
    return null;
  }

  return <>{children}</>;
}
```

## Common Operations

### User Registration (with Email Verification)

1. Frontend: POST to `/api/auth/register` with email/password/name
2. Backend: Validate DTO, hash password with bcrypt
3. Backend: Create user with `isEmailVerified: false`
4. Backend: Generate verification token (crypto.randomBytes)
5. Backend: Set token expiration (8 hours)
6. Backend: Send verification email via MailService
7. Backend: Return success message (NO JWT yet)
8. Frontend: Show "Check your email" message

### Email Verification

1. User clicks link in email → `/verify-email?token=xxx`
2. Frontend: Extract token from URL, call POST `/api/auth/verify-email`
3. Backend: Find user by verificationToken
4. Backend: Check token not expired
5. Backend: Set `isEmailVerified: true`, clear token
6. Backend: Generate JWT token (auto-login)
7. Frontend: Store token and user in localStorage
8. Frontend: Redirect to home page

### User Login

1. Frontend: POST to `/api/auth/login` with email/password
2. Backend: Find user by email
3. Backend: **Check `isEmailVerified === true`** (403 if false)
4. Backend: Compare password with bcrypt
5. Backend: Generate JWT token
6. Frontend: Store token and user in localStorage
7. Frontend: Redirect to home page

### Protected API Requests

1. Frontend: Get token from useAuth
2. Frontend: Include `Authorization: Bearer ${token}` header
3. Backend: JwtAuthGuard validates token
4. Backend: Extract user from token via @CurrentUser decorator

## Gotchas

### Password Hashing

**bcrypt with 10 rounds**: Balance between security and performance

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Key Points**:

- Industry standard (OWASP recommendation)
- ~100ms per hash (acceptable for auth operations)
- Protects against brute force attacks

### JWT Token Expiration

**Configuration**:

- Secret stored in .env (never hardcode)
- 1 day expiration (configurable)
- HS256 algorithm (symmetric)

```typescript
const token = this.jwtService.sign({ sub: user.id, email: user.email });
```

### localStorage Security Considerations

**Trade-offs**:

- ✅ Simple client-side storage
- ✅ Persists across browser sessions
- ⚠️ Vulnerable to XSS attacks (mitigated by CSP)
- ⚠️ Not suitable for highly sensitive data

**Best Practices**:

- Store only necessary user data
- Never store passwords
- Implement token expiration
- Clear on logout

## Security Patterns

### ConfigService Injection

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('1d'),
      }),
    }),
  ],
})
export class AppModule {}
```

## Email Verification Patterns

### MailService Configuration

```typescript
@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    const info = await this.transporter.sendMail({
      from: '"App Name" <noreply@example.com>',
      to: email,
      subject: 'Verify your email',
      html: `<a href="${verificationUrl}">Click to verify</a>`,
    });

    // In development with Ethereal, log preview URL
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
}
```

### Token Generation

```typescript
// Generate secure random token
const verificationToken = crypto.randomBytes(32).toString('hex');

// Set 8-hour expiration
const verificationTokenExp = new Date(Date.now() + 8 * 60 * 60 * 1000);
```

### Verification Flow in AuthService

```typescript
async verifyEmail(token: string): Promise<AuthResponse> {
  const user = await this.prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) throw new BadRequestException('Invalid token');
  if (user.verificationTokenExp < new Date()) {
    throw new BadRequestException('Token expired');
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExp: null,
    },
  });

  // Auto-login: return JWT
  const payload = { sub: user.id, email: user.email };
  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken: this.jwtService.sign(payload),
  };
}
```

## Architecture Decisions

**ADR-002**: Passport.js JWT Strategy
**ADR-007**: useAuth Hook for Authentication State
**ADR-008**: Protected Routes with HOC Pattern
**ADR-020**: Email Verification Strategy

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [API Module](api.md) - REST API patterns
- [Security Module](security.md) - Security headers, CORS
- [Frontend Module](frontend.md) - React hooks, components
