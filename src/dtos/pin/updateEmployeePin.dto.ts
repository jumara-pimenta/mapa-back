import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ETypeEditionPin } from '../../utils/ETypes';

export class UpdateEmployeePinDTO {
  @IsString({
    message: '[id] O id do ponto de embarque deve ser do tipo string.',
  })
  @IsOptional()
  id?: string;

  @ApiProperty({
    examples: ['NOVO', 'EXISTENTE'],
    enum: ETypeEditionPin,
    default: ETypeEditionPin.IS_NEW,
    description: 'Tipo de edição do Ponto de embarque',
  })
  @IsEnum(ETypeEditionPin, {
    message:
      '[typeCreation] O tipo de edição deve ser do tipo enum: NOVO | EXISTENTE.',
  })
  @IsNotEmpty({
    message: '[typeCreation] O tipo de edição deve ser preenchido.',
  })
  typeEdition: ETypeEditionPin;

  @ApiProperty({
    default: '-3.10719',
    examples: ['-3.10719', null],
    description: 'Latidude da localização',
  })
  @IsString({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsOptional()
  lat?: string;

  @ApiProperty({
    default: '-60.0261',
    examples: ['-60.0261', null],
    description: 'Longitude da localização',
  })
  @IsString({ message: '[lng] A longitude deve ser do tipo string.' })
  @IsOptional()
  lng?: string;

  @ApiProperty({
    default:
      'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
    examples: [
      'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
      null,
    ],
    description: 'Local do Ponto de Embarque',
  })
  @IsString({ message: '[local] O local deve ser do tipo string.' })
  @IsOptional()
  local?: string;

  @ApiProperty({
    default: 'Detalhes do local',
    examples: ['Detalhes do local', null],
    description: 'Detalhes sobre o ponto de embarque',
  })
  @IsString({ message: '[details] O campo detalhes deve ser do tipo string.' })
  @IsOptional()
  details?: string;

  @ApiProperty({
    default: 'Título do local',
    description: 'Título do local',
  })
  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsOptional()
  title?: string;
}
