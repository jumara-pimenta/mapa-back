import { ApiProperty } from '@nestjs/swagger';

export class MappedVehicleDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  plate: string;
  @ApiProperty()
  company: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  lastSurvey: Date | null;
  @ApiProperty()
  expiration: Date;
  @ApiProperty()
  capacity: number;
  @ApiProperty()
  renavam?: string;
  @ApiProperty()
  lastMaintenance?: Date | null;
  @ApiProperty()
  note?: string;
  @ApiProperty()
  isAccessibility: boolean;
  @ApiProperty()
  createdAt: Date;
}
