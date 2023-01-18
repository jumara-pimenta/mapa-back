import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateRouteHistoryDTO {
  @ApiProperty()
  employeesId: string;
  @ApiProperty()
  routeId: string;
}
