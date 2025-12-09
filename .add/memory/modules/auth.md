# Authentication Context

<!-- @confidence: 0.85 -->
<!-- @verified: 2024-12-09 -->
<!-- @source: code-audit -->

> **Tokens**: ~1500 | **Triggers**: auth, login, logout, jwt, token, session, guard, passport, register, user

## Overview

JWT-based authentication using Passport.js on backend, localStorage-based session management on frontend. Secure password hashing with bcrypt.

## Key Files

**Backend**:

- `apps/api/src/auth/` - Authentication module
- `apps/api/src/auth/guards/` - JWT auth guards
- `apps/api/src/auth/strategies/` - Passport strategies
- `apps/api/src/auth/decorators/` - Custom decorators (@CurrentUser)

**Frontend**:

- `apps/web/src/hooks/useAuth.ts` - Authentication hook
- `apps/web/src/components/ProtectedRoute.tsx` - Route protection HOC

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

### User Registration

1. Frontend: POST to `/api/auth/register` with email/password
2. Backend: Validate DTO, hash password with bcrypt
3. Backend: Create user in database
4. Backend: Return JWT token + user data
5. Frontend: Store token and user in localStorage via useAuth

### User Login

1. Frontend: POST to `/api/auth/login` with email/password
2. Backend: Find user by email
3. Backend: Compare password with bcrypt
4. Backend: Generate JWT token
5. Frontend: Store token and user in localStorage
6. Frontend: Redirect to home page

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

## Architecture Decisions

**ADR-002**: Passport.js JWT Strategy
**ADR-007**: useAuth Hook for Authentication State
**ADR-008**: Protected Routes with HOC Pattern

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [API Module](api.md) - REST API patterns
- [Security Module](security.md) - Security headers, CORS
- [Frontend Module](frontend.md) - React hooks, components
