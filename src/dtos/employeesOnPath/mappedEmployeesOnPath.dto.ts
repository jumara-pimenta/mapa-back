import { ApiProperty } from "@nestjs/swagger";

class IPin {
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lng: string;
}

class IEmployee {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  shift: string;
  @ApiProperty()
  registration: string;
  @ApiProperty()
  location: IPin;
}

export class MappedEmployeesOnPathDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  boardingAt?: Date;
  @ApiProperty()
  confirmation: boolean;
  @ApiProperty()
  disembarkAt?: Date;
  @ApiProperty()
  position: number;
  @ApiProperty()
  details: IEmployee;
  @ApiProperty()
  createdAt: Date;
}
