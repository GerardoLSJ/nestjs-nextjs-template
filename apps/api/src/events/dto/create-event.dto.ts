import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Team Meeting', description: 'Title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'John, Jane, Bob',
    description: 'Comma-separated list of event members',
  })
  @IsString()
  @IsNotEmpty()
  members: string;

  @ApiProperty({
    example: 'Discuss project timeline and deliverables',
    description: 'Event messages or description',
  })
  @IsString()
  @IsNotEmpty()
  messages: string;

  @ApiProperty({
    example: '2025-12-20T10:00:00Z',
    description: 'Event date and time in ISO 8601 format',
  })
  @IsDateString()
  @IsNotEmpty()
  datetime: string;
}
