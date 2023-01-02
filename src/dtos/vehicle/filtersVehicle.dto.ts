import { ApiProperty } from "@nestjs/swagger";

export class FiltersVehicleDTO {
  @ApiProperty()
  plate?: string;
  @ApiProperty()
  company?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  lastSurvey?: string;
  @ApiProperty()
  expiration?: string;
  @ApiProperty()
  capacity?: number;
  @ApiProperty()
  renavam?: string;
  @ApiProperty()
  lastMaintenance?: string;
  @ApiProperty()
  note?: string;
  @ApiProperty()
  isAccessibility?: boolean;
}
