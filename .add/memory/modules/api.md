# API Context

> **Tokens**: ~1300 | **Triggers**: api, rest, endpoint, controller, dto, validation, nestjs, swagger, openapi

## Overview

NestJS REST API with OpenAPI/Swagger documentation, class-validator DTOs, and Orval-generated client for frontend.

## Key Files

- `apps/api/src/app/` - Main application module
- `apps/api/src/auth/` - Authentication endpoints
- `apps/api/src/events/` - Events CRUD endpoints
- `apps/api/src/common/` - Shared filters, guards, decorators
- `orval.config.ts` - Orval configuration for client generation
- `apps/web/src/lib/api/` - Generated API client

## Patterns

### Controller Pattern

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(dto);
  }
}
```

### DTO Pattern with Validation

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
```

### Service Pattern

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { id: true, email: true, createdAt: true } // Exclude password
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
  }
}
```

## Common Operations

### Creating a New Endpoint

1. **Create DTO** with validation and OpenAPI decorators
2. **Create/update Service** with business logic
3. **Create/update Controller** with route handlers
4. **Add OpenAPI decorators** (@ApiOperation, @ApiResponse)
5. **Generate client**: `npm run api:generate`
6. **Use in frontend** via generated hooks

### OpenAPI/Swagger Setup

**Access Documentation**:
- Local: http://localhost:3333/api/docs
- Interactive UI for testing endpoints

**Configuration** in `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('API')
  .setDescription('API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Contract Generation with Orval

**Configuration** (`orval.config.ts`):

```typescript
export default {
  'api-client': {
    output: {
      mode: 'tags-split',
      target: 'apps/web/src/lib/api/generated',
      client: 'react-query',
      override: {
        mutator: {
          path: 'apps/web/src/lib/api/client.ts',
          name: 'customFetch',
        },
      },
    },
    input: {
      target: 'http://localhost:3333/api-json',
    },
  },
};
```

**Generate Client**:

```bash
npm run api:generate
```

**Usage in Frontend**:

```typescript
import { useGetEvents, useCreateEvent } from '@/lib/api/generated/events';

function Component() {
  const { data, isLoading } = useGetEvents();
  const createMutation = useCreateEvent();

  const handleCreate = (event: CreateEventDto) => {
    createMutation.mutate(event);
  };

  return <div>{/* Use data */}</div>;
}
```

## Gotchas

### Phase 2: Contract Generation

**Problem**: Orval-generated client had URL resolution issues in tests

**Solution**: Custom fetch wrapper that handles relative URLs

```typescript
export const customFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const response = await fetch(fullUrl, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};
```

**Key Learnings**:
1. Generated clients need explicit base URL handling in test environments
2. Update all test mocks when migrating to generated client
3. Error expectations must match generated client format

### ConfigService Injection

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
```

## Quick Commands

```bash
npx nx serve api          # Start API server (port 3333)
npm run api:generate      # Generate OpenAPI client
npx nx test api           # Run API unit tests
npx nx e2e api-e2e        # Run API E2E tests
```

## Architecture Decisions

**ADR-015**: Phase 2 Completion (Contract Generation)

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [Auth Module](auth.md) - Authentication endpoints
- [Database Module](database.md) - Prisma integration
- [Frontend Module](frontend.md) - Generated client usage
- [Testing Module](testing.md) - API testing patterns
