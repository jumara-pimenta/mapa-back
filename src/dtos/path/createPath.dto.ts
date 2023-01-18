import { ApiProperty } from '@nestjs/swagger';
import { PathDetailsDTO } from './pathDetails.dto';

export class CreatePathDTO {
  @ApiProperty()
  details: PathDetailsDTO;
  @ApiProperty()
  employeeIds: string[];
  @ApiProperty()
  routeId: string;
}
