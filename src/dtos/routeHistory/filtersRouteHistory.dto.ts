import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FiltersRouteHistoryDTO {
  @ApiProperty({required: false})
  @IsOptional()
  nameRoute?: string;
  
  @ApiProperty({required: false})
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({required: false})
  @IsOptional()
  vehiclePlate?: String;

  @ApiProperty({required: false})
  @IsOptional()
  driverName?: String;
}
