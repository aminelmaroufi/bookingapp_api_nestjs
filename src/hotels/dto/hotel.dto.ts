import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Name of the hotel' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Type of the hotel' })
  type: string;

  @IsString()
  @ApiProperty({ description: 'Country of the hotel' })
  country: string;

  @IsString()
  @ApiProperty({ description: 'City of the hotel' })
  city: string;

  @IsString()
  @ApiProperty({ description: 'Adress of the hotel' })
  address: string;

  @IsString()
  @ApiProperty({ description: 'Short address of the hotel' })
  short_address: string;

  @IsString()
  @ApiProperty({ description: 'Location of the hotel' })
  location: string;

  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @ApiProperty({ description: 'Rating of the hotel' })
  rating: number;
}

export class HotelCreatedResponseDto {
  ok: boolean;
  result: {
    message: string;
    hotel: HotelDto;
  };
}

export class GetHotelsResponseDto {
  ok: boolean;
  result: {
    message: string;
    hotels: HotelDto[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
