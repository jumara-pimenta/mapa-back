import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeesOnPathDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  process?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(15)
  @IsOptional()
  product?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sequenceQr?: number;

  @ApiProperty()
  @MinLength(2)
  @MaxLength(3)
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  confirmation?: boolean;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  boardingAt?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  disembarkAt?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
