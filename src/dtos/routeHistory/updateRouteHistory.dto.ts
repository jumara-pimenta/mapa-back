import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRouteHistoryDTO {
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
}
