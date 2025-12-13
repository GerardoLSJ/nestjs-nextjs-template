import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890', description: 'Verification token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
