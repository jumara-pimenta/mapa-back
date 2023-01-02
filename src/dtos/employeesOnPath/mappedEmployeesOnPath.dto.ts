import { ApiProperty } from "@nestjs/swagger";

class IPin {
  lat: string;
  lng: string;
}

class IEmployee {
  name: string;
  address: string;
  shift: string;
  registration: string;
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
