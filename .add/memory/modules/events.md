# Events Context

<!-- @confidence: 0.80 -->
<!-- @verified: 2024-12-09 -->
<!-- @source: code-audit -->

> **Tokens**: ~900 | **Triggers**: event, events, planner, calendar, useevents

## Overview

Event planner feature allowing users to create, view, and delete events. Full CRUD with PostgreSQL persistence, JWT authentication, and ownership validation.

## Key Files

**Backend**:

- `apps/api/src/events/` - Events module
- `apps/api/src/events/events.controller.ts` - REST endpoints
- `apps/api/src/events/events.service.ts` - Business logic
- `apps/api/src/events/dto/` - DTOs for events
- `prisma/schema.prisma` - Event model definition

**Frontend**:

- `apps/web/src/hooks/useEvents.ts` - Events hook
- `apps/web/src/components/EventForm.tsx` - Create event form
- `apps/web/src/components/EventList.tsx` - Display events
- `apps/web/src/components/CalendarPicker.tsx` - Date picker

## Patterns

### Event Model

```prisma
model Event {
  id        String   @id @default(uuid())
  title     String
  members   String
  dateTime  String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Backend Endpoints

```typescript
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events for current user' })
  async getEvents(@CurrentUser() user: User) {
    return this.eventsService.findAllForUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  async createEvent(@CurrentUser() user: User, @Body() dto: CreateEventDto) {
    return this.eventsService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event by ID' })
  async deleteEvent(@CurrentUser() user: User, @Param('id') id: string) {
    return this.eventsService.delete(user.id, id);
  }
}
```

### Frontend Hook

```typescript
export function useEvents() {
  const { data, isLoading, error, refetch } = useGetEvents();

  const createMutation = useCreateEvent({
    onSuccess: () => refetch(),
  });

  const deleteMutation = useDeleteEvent({
    onSuccess: () => refetch(),
  });

  const createEvent = (input: CreateEventInput) => {
    createMutation.mutate(input);
  };

  const deleteEvent = (id: string) => {
    deleteMutation.mutate({ id });
  };

  return {
    events: data || [],
    isLoading,
    error,
    createEvent,
    deleteEvent,
  };
}
```

## Common Operations

### Creating an Event

1. **User fills EventForm**: title, members, date/time
2. **CalendarPicker**: User selects date
3. **Frontend validation**: Required fields checked
4. **API call**: POST /api/events with CreateEventDto
5. **Backend validation**: DTO validation + ownership
6. **Database**: Prisma creates event linked to user
7. **Frontend**: Refetch events, display updated list

### Deleting an Event

1. **User clicks delete**: On event card
2. **API call**: DELETE /api/events/:id
3. **Backend validation**: Ownership check (user can only delete their events)
4. **Database**: Prisma deletes event
5. **Frontend**: Refetch events, remove from UI

## Gotchas

### Migration from localStorage to Database

**Phase 1**: localStorage (POC)

- Simple client-side storage
- No authentication required
- Fast prototyping

**Phase 2**: PostgreSQL (Production)

- Server-side persistence
- JWT authentication required
- Ownership validation
- Sync across devices

**Key Changes**:

- Added `userId` foreign key
- Implemented ownership checks
- Updated frontend to handle auth
- Skipped localStorage-specific tests

### CalendarPicker Implementation

**Decision**: Custom component (no external library)

**Features**:

- Month/year navigation
- Date selection
- Native Date object usage
- CSS Modules styling
- Mobile-responsive

**Testing Gotcha**: Always construct dates using local time to match component logic:

```typescript
// Correct
const date = new Date(2024, 0, 15); // January 15, 2024 (local time)

// Incorrect (causes timezone failures)
const date = new Date('2024-01-15'); // UTC, may be different day locally
```

### Event Ownership

**Backend Validation**:

```typescript
async delete(userId: string, eventId: string) {
  // Verify ownership
  const event = await this.prisma.event.findUniqueOrThrow({
    where: { id: eventId },
  });

  if (event.userId !== userId) {
    throw new ForbiddenException('You can only delete your own events');
  }

  return this.prisma.event.delete({ where: { id: eventId } });
}
```

## Architecture Decisions

**ADR-011**: localStorage for Event Persistence (Phase 1)
**ADR-014**: Calendar Picker Implementation

See [memory/decisions/](../decisions/) for full ADRs.

## Related

- [Auth Module](auth.md) - JWT authentication for events
- [Database Module](database.md) - Event model and Prisma
- [Frontend Module](frontend.md) - React components and hooks
