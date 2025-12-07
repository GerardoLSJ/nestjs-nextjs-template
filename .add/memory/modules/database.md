# Database Context

> **Tokens**: ~1200 | **Triggers**: database, prisma, postgres, postgresql, entity, migration, schema, model

## Overview

PostgreSQL database with Prisma ORM. Database runs in Docker, migrations managed via Prisma CLI.

## Key Files

- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Migration history
- `apps/api/src/prisma/` - Prisma service integration
- `docker-compose.yml` - PostgreSQL container configuration

## Patterns

### Prisma Service Pattern

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Usage in Services**:

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

## Common Operations

### Creating a New Model

1. **Define schema** in `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Generate migration**:

```bash
npx prisma migrate dev --name add_user_model
```

3. **Generate Prisma client**:

```bash
npx prisma generate
```

### Running Migrations

**Development**:
```bash
npx prisma migrate dev --name descriptive_name
```

**Production**:
```bash
npx prisma migrate deploy
```

### Database GUI

**Prisma Studio**:
```bash
npx prisma studio
```

Opens GUI at http://localhost:5555 for inspecting/editing data.

## Gotchas

### Client Generation

**Problem**: Prisma client must be regenerated after schema changes

**Solution**: Run after any schema modification:

```bash
npx prisma generate
```

**Automated**: Add to package.json postinstall:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Migration Conflicts

**Problem**: Multiple developers creating migrations simultaneously

**Solution**:
1. Pull latest migrations from git
2. Reset local database if needed: `npx prisma migrate reset`
3. Create new migration with descriptive name

### findUniqueOrThrow vs findUnique

**findUniqueOrThrow**: Throws exception if not found (preferred)

```typescript
const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
```

**findUnique**: Returns null if not found (requires manual check)

```typescript
const user = await this.prisma.user.findUnique({ where: { id } });
if (!user) throw new NotFoundException('User not found');
```

## Quick Commands

```bash
npm run db:up          # Start PostgreSQL (Docker)
npm run db:down        # Stop PostgreSQL
npm run db:logs        # View logs
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Run migrations
npm run db:generate    # Generate Prisma client
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

**Test Database**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/test_db?schema=public"
```

## Architecture Decisions

**ADR-001**: Nx Monorepo (includes database strategy)

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [API Module](api.md) - NestJS services using Prisma
- [Auth Module](auth.md) - User model and authentication
- [Events Module](events.md) - Event model and ownership
