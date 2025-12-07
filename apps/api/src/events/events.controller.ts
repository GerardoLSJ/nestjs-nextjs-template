import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(req.user.userId, createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for current user' })
  @ApiResponse({ status: 200, description: 'List of events' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.eventsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your event' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.eventsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your event' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(@Request() req, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, req.user.userId, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your event' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Request() req, @Param('id') id: string) {
    return this.eventsService.remove(id, req.user.userId);
  }
}
