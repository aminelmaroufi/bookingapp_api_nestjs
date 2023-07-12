import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  stripeId?: string;

  @IsOptional()
  cards?: string[];

  // Add more properties as needed

  @IsOptional()
  data?: Record<string, any>;

  @IsString()
  provider: string;

  // Add more properties as needed

  @IsOptional()
  roles?: string[];

  // Add more properties as needed

  @IsOptional()
  resetPasswordToken?: string;

  @IsOptional()
  resetPasswordExpires?: Date;

  @IsBoolean()
  isMale: boolean;

  @IsDate()
  birthdate: Date;
}
