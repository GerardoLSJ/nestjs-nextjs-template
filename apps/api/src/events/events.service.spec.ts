import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EventsService } from './events.service';
import { PrismaService } from '../database/prisma.service';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;

  const mockEvent = {
    id: 'event-1',
    title: 'Team Meeting',
    members: 'John, Jane, Bob',
    datetime: new Date('2025-12-20T10:00:00Z'),
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserId = 'user-1';
  const otherUserId = 'user-2';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: {
            event: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create an event', async () => {
      const createEventDto = {
        title: 'Team Meeting',
        members: 'John, Jane, Bob',
        datetime: '2025-12-20T10:00:00Z',
      };

      jest.spyOn(prismaService.event, 'create').mockResolvedValue(mockEvent);

      const result = await service.create(mockUserId, createEventDto);

      expect(prismaService.event.create).toHaveBeenCalledWith({
        data: {
          title: createEventDto.title,
          members: createEventDto.members,
          datetime: new Date(createEventDto.datetime),
          userId: mockUserId,
        },
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return all events for a user', async () => {
      const mockEvents = [mockEvent, { ...mockEvent, id: 'event-2' }];

      jest.spyOn(prismaService.event, 'findMany').mockResolvedValue(mockEvents);

      const result = await service.findAll(mockUserId);

      expect(prismaService.event.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { datetime: 'asc' },
      });
      expect(result).toEqual(mockEvents);
    });

    it('should return empty array if user has no events', async () => {
      jest.spyOn(prismaService.event, 'findMany').mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an event if user owns it', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);

      const result = await service.findOne(mockEvent.id, mockUserId);

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event does not exist', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent', mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the event', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);

      await expect(service.findOne(mockEvent.id, otherUserId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should successfully update an event', async () => {
      const updateEventDto = {
        title: 'Updated Meeting',
      };

      const updatedEvent = { ...mockEvent, ...updateEventDto };

      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);
      jest.spyOn(prismaService.event, 'update').mockResolvedValue(updatedEvent);

      const result = await service.update(mockEvent.id, mockUserId, updateEventDto);

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
      });
      expect(prismaService.event.update).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
        data: updateEventDto,
      });
      expect(result).toEqual(updatedEvent);
    });

    it('should throw NotFoundException if event does not exist', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent', mockUserId, { title: 'Updated' })
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.event.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the event', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);

      await expect(service.update(mockEvent.id, otherUserId, { title: 'Updated' })).rejects.toThrow(
        ForbiddenException
      );

      expect(prismaService.event.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete an event', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);
      jest.spyOn(prismaService.event, 'delete').mockResolvedValue(mockEvent);

      const result = await service.remove(mockEvent.id, mockUserId);

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
      });
      expect(prismaService.event.delete).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
      });
      expect(result).toEqual({ message: 'Event successfully deleted' });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('non-existent', mockUserId)).rejects.toThrow(NotFoundException);

      expect(prismaService.event.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the event', async () => {
      jest.spyOn(prismaService.event, 'findUnique').mockResolvedValue(mockEvent);

      await expect(service.remove(mockEvent.id, otherUserId)).rejects.toThrow(ForbiddenException);

      expect(prismaService.event.delete).not.toHaveBeenCalled();
    });
  });
});
