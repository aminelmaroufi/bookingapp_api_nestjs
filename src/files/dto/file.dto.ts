import { IsString, IsEnum, IsNumber } from 'class-validator';

export class FileDto {
  @IsString()
  _id: string;
  @IsString()
  filename: string;
}
