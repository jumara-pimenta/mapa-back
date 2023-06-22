import { ApiProperty } from '@nestjs/swagger';
import { EmployeeAddressDTO } from '../employee/employeeAddress.dto';

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
  address: string | EmployeeAddressDTO;
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
  present?: boolean;
  @ApiProperty()
  position: number;
  @ApiProperty()
  details: IEmployee;
  @ApiProperty()
  createdAt: Date;
}
