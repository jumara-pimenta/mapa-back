import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { randomUUID } from 'crypto';
import { ETypePath, ETypeRoute } from '../../utils/ETypes';
import { PathDetailsDTO } from '../path/pathDetails.dto';

export class CreateRouteDTO {
  @ApiProperty({ default: 'Rota 1', example: 'Rota 1' })
  @IsString({ message: '[Description] não está definida como string.' })
  @IsNotEmpty({ message: '[Description] não pode receber um valor vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    default: ETypeRoute.CONVENTIONAL,
    enum: [ETypeRoute.CONVENTIONAL, ETypeRoute.ESPECIAL, ETypeRoute.EXTRA],
  })
  @IsEnum(ETypeRoute, { message: '[Type] não está definida como enum.' })
  @IsNotEmpty({ message: '[Type] não pode receber um valor vazio.' })
  type: ETypeRoute;

  @ApiProperty({
    default: '05e7ce8b-b3e2-4295-b584-8e2caae2d809',
    example: '05e7ce8b-b3e2-4295-b584-8e2caae2d809',
  })
  @IsString({ message: '[DriverId] não está definida como string.' })
  @IsNotEmpty({ message: '[DriverId] não pode receber um valor vazio.' })
  driverId: string;

  @ApiProperty({
    default: '41b4eb3d-e18a-4c8e-a668-49824b21579c',
    example: '41b4eb3d-e18a-4c8e-a668-49824b21579c',
  })
  @IsString({ message: '[VehicleId] não está definida como string.' })
  @IsNotEmpty({ message: '[VehicleId] não pode receber um valor vazio.' })
  vehicleId: string;

  @ApiProperty({
    default: [
      '67547947-36c1-43d2-9ae1-e545ade7f9f6',
      'ff95411a-ca98-4400-90a8-5657115da140',
      '514802aa-8265-432e-a7ce-30942a697a77',
      '4b4b626c-071c-4b02-9f08-03fb919ef557',
    ],
    example: [
      '67547947-36c1-43d2-9ae1-e545ade7f9f6',
      'ff95411a-ca98-4400-90a8-5657115da140',
      '514802aa-8265-432e-a7ce-30942a697a77',
      '4b4b626c-071c-4b02-9f08-03fb919ef557',
    ],
  })
  @IsString({
    each: true,
    message: '[EmployeeIds] não está definida como string.',
  })
  @IsNotEmpty({ message: '[EmployeeIds] não pode receber um valor vazio.' })
  employeeIds: string[];

  @ApiProperty()
  @ValidateNested({
    each: true,
    message: '[PathDetails] não está definida como PathDetailsDTO.',
  })
  @Type(() => PathDetailsDTO)
  @IsNotEmpty({ message: '[PathDetails] não pode receber um valor vazio.' })
  pathDetails: PathDetailsDTO;
}
