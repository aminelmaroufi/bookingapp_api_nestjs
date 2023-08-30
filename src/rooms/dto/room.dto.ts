import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'title of the room' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'advantage of the room' })
  advantage: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Price of the room' })
  price: number;
}
