import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeesOnPathDTO } from './updateEmployeesOnPath.dto';

export class WebsocketUpdateEmployeesStatusOnPathDTO {
  @ApiProperty()
  @IsString({ message: '[pathId] O id do trajeto deve ser do tipo string.'})
  pathId: string;

  @ApiProperty()
  @IsString({ message: '[routeId] O id da rota deve ser do tipo string.'})
  routeId: string;

  @ApiProperty()
  @IsString({ message: '[employeeOnPathId] O id do colaborador no trajeto deve ser do tipo string.'})
  employeeOnPathId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeesOnPathDTO)
  payload: UpdateEmployeesOnPathDTO;
}
