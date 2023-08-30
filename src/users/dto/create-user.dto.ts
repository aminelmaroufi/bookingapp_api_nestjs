import { ApiProperty } from '@nestjs/swagger';
import { match } from 'assert';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDate,
  isString,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

const PHONE_REGEX = /^\d{3}\d{3}\d{4}$/;

export class CreateUserDto {
  @ApiProperty({
    description: 'Customer firstname',
    example: 'john',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'Customer lastname',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer phone',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_REGEX, {
    message: 'Invalid phone number',
  })
  phone?: string;

  @ApiProperty({
    description: 'Customer password',
    example: '',
    required: true,
  })
  @MinLength(6)
  @Matches(/[*@!#%&()^~{}]+/, {
    message:
      'Password must contain at least 8 characters, including one letter and one number',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Customer confirm_password',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirm_password: string;
}
