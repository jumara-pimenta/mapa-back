import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeesOnPathDTO {
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
