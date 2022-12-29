import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ETypePin } from '../../utils/ETypes';

export class AssociateEmployeeOnPinDTO {
  @IsString({ message: '[employeeId] O id do colaborador deve ser do tipo string.' })
  @IsNotEmpty({ message: '[employeeId] O id do colaborador deve ser preenchido.' })
  employeeId: string;

  @IsString({ message: '[pinId] O id do ponto de embarque deve ser do tipo string.' })
  @IsNotEmpty({ message: '[pinId] O id do ponto de embarque deve ser preenchido.' })
  pinId: string;

  @IsEnum(ETypePin, { message: '[type] O tipo do ponto de embarque deve ser do tipo enum: CONVENCIONAL | ESPECIAL' })
  @IsNotEmpty({ message: '[type] O tipo do ponto de embarque deve ser preenchido.' })
  type: ETypePin;
}
