import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  members: string;

  @IsDateString()
  @IsNotEmpty()
  datetime: string;
}
