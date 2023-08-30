import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class BookingDto {
  @IsString()
  customer: string;

  @IsString()
  hotel: string;

  @IsString()
  room: string;

  @IsString()
  card: string;

  @IsString()
  payment_auth: string;

  @IsString()
  amount: number;

  @IsString()
  check_in_date: Date;

  @IsString()
  check_out_date: Date;

  @IsString()
  night_numbers: string;
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Hotel ID',
    required: true,
  })
  @IsString()
  hotel: string;

  @ApiProperty({
    description: 'Room ID',
    required: true,
  })
  @IsString()
  room: string;

  @ApiProperty({
    description: 'Card ID',
    required: true,
  })
  @IsString()
  card: string;

  @ApiProperty({
    description: 'Check-in date',
    required: true,
  })
  @IsDateString()
  check_in_date: Date;

  @ApiProperty({
    description: 'Check-out date',
    required: true,
  })
  @IsDateString()
  check_out_date: Date;

  @ApiProperty({
    description: 'Booking total night numbers',
    required: true,
  })
  @IsNumber()
  night_numbers: number;

  @ApiProperty({
    description: 'Booking total Price',
    required: true,
  })
  @IsNumber()
  amount: number;
}
