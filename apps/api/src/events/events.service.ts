import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        datetime: new Date(createEventDto.datetime),
        userId,
      },
    });

    return event;
  }

  async findAll(userId: string) {
    const events = await this.prisma.event.findMany({
      where: { userId },
      orderBy: { datetime: 'asc' },
    });

    return events;
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this event');
    }

    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    // Check ownership
    await this.findOne(id, userId);

    const updateData: Record<string, unknown> = { ...updateEventDto };
    if (updateEventDto.datetime) {
      updateData.datetime = new Date(updateEventDto.datetime);
    }

    const event = await this.prisma.event.update({
      where: { id },
      data: updateData,
    });

    return event;
  }

  async remove(id: string, userId: string) {
    // Check ownership
    await this.findOne(id, userId);

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: 'Event successfully deleted' };
  }
}
