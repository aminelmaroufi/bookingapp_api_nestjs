import { IsString, IsEnum, IsNumber } from 'class-validator';

export class HotelDto {
  _id: string;
  name: string;
  rating: number;
  main_picture: string;
  second_picture: string;
  short_address: string;
  city: string;
  country: string;
  address: string;
  location: string;
  type: string;
  rooms: Array<string>;
  created_at: Date;
  updated_at: Date;
}

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  short_address: string;

  @IsString()
  location: string;

  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  rating: number;
}
