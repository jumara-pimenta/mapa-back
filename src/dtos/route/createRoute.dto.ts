import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { ETypeRoute } from '../../utils/ETypes';
import { PathDetailsDTO } from '../path/pathDetails.dto';

export class CreateRouteDTO {
  @IsString({ message: '[description] A descrição deve ser do tipo string.' })
  @IsNotEmpty({ message: '[description] A descrição deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @IsEnum(ETypeRoute, {
    message:
      '[type] O tipo da rota deve ser do tipo enum: CONVENCIONAL | ESPECIAL | EXTRA',
  })
  @IsNotEmpty({ message: '[type] O tipo da rota deve ser preenchido.' })
  type: ETypeRoute;

  @IsString({
    message: '[driverId] O id do motorista deve ser do tipo string.',
  })
  @IsNotEmpty({ message: '[driverId] O id do motorista deve ser preenchido.' })
  driverId: string;

  @IsString({
    message: '[vehicleId] O id do veículo deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[vehicleId] O id do veículo deve ser preenchido.',
  })
  vehicleId: string;

  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[employeeIds] Os ids dos colaboradores devem ser preenchidos.',
  })
  employeeIds: string[];

  @ValidateNested({
    each: true,
  })
  @Type(() => PathDetailsDTO)
  @IsNotEmpty({
    message: '[pathDetails] Os detalhes do trajeto devem ser preenchidos.',
  })
  pathDetails: PathDetailsDTO;
}
