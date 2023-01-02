import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ETypeCreationPin } from '../../utils/ETypes';

export class CreateEmployeePinDTO {
  @IsEnum(ETypeCreationPin, {
    message:
      '[typeCreation] O tipo de criação deve ser do tipo enum: EXISTENTE | NOVO',
  })
  @IsNotEmpty({
    message: '[typeCreation] O tipo de criação deve ser preenchido.',
  })
  typeCreation: ETypeCreationPin;

  @IsString({
    message: '[id] O id do ponto de embarque deve ser do tipo string.',
  })
  @IsOptional()
  id?: string;

  @IsString({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsOptional()
  lat?: string;

  @IsString({ message: '[lng] A longitude deve ser do tipo string.' })
  @IsOptional()
  lng?: string;

  @IsString({ message: '[local] O local deve ser do tipo string.' })
  @IsOptional()
  local?: string;

  @IsString({
    message: '[details] O campo de detalhes deve ser do tipo string.',
  })
  @IsOptional()
  details?: string;

  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsOptional()
  title?: string;
}
