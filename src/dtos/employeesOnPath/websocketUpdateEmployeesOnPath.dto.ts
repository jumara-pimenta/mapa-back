import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeesOnPathDTO } from './updateEmployeesOnPath.dto';

export class WebsocketUpdateEmployeesStatusOnPathDTO {
  @ApiProperty()
  @IsString()
  pathId: string;

  @ApiProperty()
  @IsString()
  routeId: string;

  @ApiProperty()
  @IsString()
  employeeOnPathId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeesOnPathDTO)
  payload: UpdateEmployeesOnPathDTO;
}
