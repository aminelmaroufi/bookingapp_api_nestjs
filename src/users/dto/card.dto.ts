import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const VISA_NUMBER_REGEX =
  /^(?:4\d{3}|5[1-5]\d{2}|6011|3[47]\d{2})([- ]?)\d{4}\1\d{4}\1\d{4}$/;
const EXPIREDATE_REGEX = /^\d{2}\/\d{2}$/;

export class CardDto {
  @IsString()
  _id: string;

  @IsString()
  brand: string;

  @IsString()
  number: string;
}

export class CreateCardDto {
  @ApiProperty({
    description: 'Card name',
    example: 'Joe Doe',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Card number',
    example: '',
    required: true,
  })
  @Matches(VISA_NUMBER_REGEX, {
    message: 'Invalid visa card number',
  })
  @IsNumberString()
  number: string;

  @ApiProperty({
    description: 'Card CVV',
    example: '',
    required: true,
  })
  @MinLength(3)
  @MaxLength(3)
  @IsNumberString()
  cvc: string;

  @ApiProperty({
    description: 'Card expire_date',
    example: '',
    required: true,
  })
  @Matches(EXPIREDATE_REGEX, {
    message: 'Invalid card expire date value',
  })
  @IsString()
  expire_date: string;
}
