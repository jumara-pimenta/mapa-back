import { ApiProperty } from '@nestjs/swagger';
import { MappedRouteDTO } from '../route/mappedRoute.dto';

export class MappedRouteHistoryDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  employeeIds: string;
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
