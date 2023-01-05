import { ApiProperty } from '@nestjs/swagger';

export class FiltersVehicleDTO {
  @ApiProperty({required: false})
  plate?: string;
  @ApiProperty({required: false})
  company?: string;
  @ApiProperty({required: false})
  type?: string;
  @ApiProperty({required: false})
  lastSurvey?: string;
  @ApiProperty({required: false})
  expiration?: string;
  @ApiProperty({required: false})
  capacity?: number;
  @ApiProperty({required: false})
  renavam?: string;
  @ApiProperty({required: false})
  lastMaintenance?: string;
  @ApiProperty({required: false})
  note?: string;
  @ApiProperty({required: false})
  isAccessibility?: boolean;
}
