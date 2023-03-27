import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class FiltersNameDriverVehicleDateRouteHistoryDTO {
  @ApiProperty({required: false})
  @IsOptional()
  nameRoute?: string;
  
  @ApiProperty({required: true})
  @IsDateString()
  createdDate: Date;

  @ApiProperty({required: false})
  @IsOptional()
  vehicleId?: String;

  @ApiProperty({required: false})
  @IsOptional()
  driverId?: String;

}
