import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PathDetailsDTO } from '../path/pathDetails.dto';
import { ETypeRoute, ETypeShiftRotue } from '../../utils/ETypes';

export class CreateRouteDTO {
  @ApiProperty({
    default: 'Rota 1',
    example: 'Rota 1',
    description: 'Descrição da rota',
  })
  @IsString({ message: '[description] A descrição deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[description] A descrição deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    default: ETypeRoute.CONVENTIONAL,
    enum: [ETypeRoute.CONVENTIONAL, ETypeRoute.EXTRA],
    description: 'Tipo da Rota: Convencional ou Extra',
  })
  @IsEnum(ETypeRoute, { message: '[Type] não está definida como enum.' })
  @IsNotEmpty({ message: '[Type] não pode receber um valor vazio.' })
  type: ETypeRoute;

  @ApiProperty({
    default: '05e7ce8b-b3e2-4295-b584-8e2caae2d809',
    description: 'Id do motorista',
  })
  @IsString({ message: '[DriverId] não está definida como texto.' })
  // @IsNotEmpty({ message: '[DriverId] não pode receber um valor vazio.' })
  @IsOptional()
  driverId?: string;

  @ApiProperty({
    default: '41b4eb3d-e18a-4c8e-a668-49824b21579c',
    description: 'Id do veículo',
  })
  @IsString({ message: '[VehicleId] não está definida como texto.' })
  // @IsNotEmpty({ message: '[VehicleId] não pode receber um valor vazio.' })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({
    default: [
      '67547947-36c1-43d2-9ae1-e545ade7f9f6',
      'ff95411a-ca98-4400-90a8-5657115da140',
      '514802aa-8265-432e-a7ce-30942a697a77',
      '4b4b626c-071c-4b02-9f08-03fb919ef557',
    ],
    description: 'Id dos colaboradores',
  })
  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo texto.',
  })
  @IsNotEmpty({
    message: '[employeeIds] Os ids dos colaboradores devem ser preenchidos.',
  })
  employeeIds: string[];

  @ApiProperty({ description: 'Detalhes do trajeto' })
  @ValidateNested({
    each: true,
  })
  @Type(() => PathDetailsDTO)
  @IsNotEmpty({
    message: '[pathDetails] Os detalhes do trajeto devem ser preenchidos.',
  })
  pathDetails: PathDetailsDTO;

  @ApiProperty({
    description: 'Turno da rota',
    default: 'PRIMEIRO',
    enum: ['PRIMEIRO', 'SEGUNDO', 'TERCEIRO'],
  })
  @IsOptional()
  @IsEnum(ETypeShiftRotue, {
    message: '[shift] Turno não está definido como enum.',
  })
  shift?: ETypeShiftRotue;

  @ApiProperty({
    description: 'Distância da rota',
    default: '10.5 KM',
  })
  @IsOptional()
  @IsString({ message: '[distance] A distância deve ser do tipo texto.' })
  distance?: string;

  @ApiProperty({
    description: 'Data da rota extra',
    default: '10.5 KM',
  })
  @IsOptional()
  @IsString({
    message:
      '[scheduleDate] A Data do agendamento extra tem que ser do tipo texto',
  })
  scheduleDate?: string;
}
