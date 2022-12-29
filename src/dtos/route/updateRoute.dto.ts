import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatusRoute, ETypeRoute } from '../../utils/ETypes';

export class UpdateRouteDTO {
  @IsString({ message: '[description] A descrição deve ser do tipo string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '[distance] A distância deve ser do tipo string.' })
  @IsOptional()
  distance?: string;

  @IsEnum(ETypeRoute, { message: '[type] O tipo da rota deve ser do tipo enum: CONVENCIONAL | ESPECIAL | EXTRA' })
  @IsOptional()
  type?: ETypeRoute;

  @IsEnum(EStatusRoute, { message: '[status] O status deve ser do tipo enum: PENDENTE | EM ANDAMENTO' })
  @IsOptional()
  status?: EStatusRoute;

  @IsString({ message: '[driverId] O id do motorista deve ser do tipo string.' })
  @IsOptional()
  driverId?: string;

  @IsString({ message: '[vehicleId] O id do veículo deve ser do tipo string.' })
  @IsOptional()
  vehicleId?: string;

  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo string.',
  })
  @IsOptional()
  employeeIds?: string[];
}
