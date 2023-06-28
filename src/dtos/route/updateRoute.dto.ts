import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EStatusRoute, ETypeRoute, ETypeShiftRotue } from '../../utils/ETypes';

export class UpdateRouteDTO {
  @ApiProperty({ description: 'Descrição da rota' })
  @IsString({ message: '[description] A descrição deve ser do tipo texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Distância da rota' })
  @IsString({ message: '[distance] A distância deve ser do tipo texto.' })
  @IsOptional()
  distance?: string;

  @ApiProperty({ description: 'Tipo da Rota: Convencional, Especial ou Extra' })
  @IsEnum(ETypeRoute, {
    message:
      '[type] O tipo da rota deve ser do tipo enum: CONVENCIONAL | ESPECIAL | EXTRA',
  })
  @IsOptional()
  type?: ETypeRoute;

  @ApiProperty({ description: 'Duração da rota' })
  @IsString({
    message: '[duration] Duração da rota tem que ser do tipo texto.',
  })
  @IsOptional()
  duration?: string;

  @ApiProperty({ description: 'Status da Rota: Pendente ou Em Andamento' })
  @IsEnum(EStatusRoute, {
    message: '[status] O status deve ser do tipo enum: PENDENTE | EM ANDAMENTO',
  })
  @IsOptional()
  status?: EStatusRoute;

  @ApiProperty({ description: 'Id do motorista' })
  @IsString({
    message: '[driverId] O id do motorista deve ser do tipo texto.',
  })
  @IsOptional()
  driverId?: string;

  @ApiProperty({ description: 'Id do veículo' })
  @IsString({ message: '[vehicleId] O id do veículo deve ser do tipo texto.' })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ description: 'Id dos colaboradores' })
  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo texto.',
  })
  @IsOptional()
  employeeIds?: string[];

  @ApiProperty({ description: 'Horário da ida.' })
  @IsString({
    each: true,
    message: '[startsAt] O horário da ida tem que ser do tipo texto.',
  })
  @IsOptional()
  startsAt?: string;

  @ApiProperty({ description: 'Horário da volta' })
  @IsString({
    each: true,
    message: '[startsReturnAt] O horário da volta tem que ser do tipo texto.',
  })
  @IsOptional()
  startsReturnAt?: string;

  @ApiProperty({ description: 'Horário da volta' })
  @IsEnum(ETypeShiftRotue, {
    message:
      '[shift] O turno deve ser do tipo enum: PRIMEIRO ou SEGUNDO ou TERCEIRO',
  })
  @IsOptional()
  shift?: ETypeShiftRotue;
}
