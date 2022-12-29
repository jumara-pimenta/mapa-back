import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { UpdateEmployeesOnPathDTO } from './updateEmployeesOnPath.dto';

export class WebsocketUpdateEmployeesStatusOnPathDTO {
  @IsString({ message: '[pathId] O id do trajeto deve ser do tipo string.'})
  pathId: string;

  @IsString({ message: '[routeId] O id da rota deve ser do tipo string.'})
  routeId: string;

  @IsString({ message: '[employeeOnPathId] O id do colaborador no trajeto deve ser do tipo string.'})
  employeeOnPathId: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeesOnPathDTO)
  payload: UpdateEmployeesOnPathDTO;
}
