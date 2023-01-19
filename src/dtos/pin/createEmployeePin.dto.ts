import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ETypeCreationPin } from '../../utils/ETypes';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeePinDTO {
  @ApiProperty({
    examples: ['NOVO', 'EXISTENTE'],
    enum: ETypeCreationPin,
    default: ETypeCreationPin.IS_NEW,
    description: 'Tipo de criação',
  })
  @IsEnum(ETypeCreationPin, {
    message:
      '[typeCreation] O tipo de criação deve ser do tipo enum: EXISTENTE | NOVO',
  })
  @IsNotEmpty({
    message: '[typeCreation] O tipo de criação deve ser preenchido.',
  })
  typeCreation: ETypeCreationPin;

  @ApiProperty({
    default: null,
    examples: [null, '74a7134e-5062-4dd8-9167-26dd0cc4e1b7'],
    description:
      'caso typeCreation seja EXISTENTE\n\r\nId do pin que será atualizado.',
  })
  @IsString({ message: '[id] não está definido como string.' })
  @IsOptional()
  id?: string;

  @ApiProperty({
    default: '-3.10719',
    examples: ['-3.10719', null],
    description: 'Latidude da localização',
  })
  @IsString({ message: '[lat] não está definido como string.' })
  @IsOptional()
  lat?: string;

  @ApiProperty({
    default: '-60.0261',
    examples: ['-60.0261', null],
    description: 'Longitude da localização',
  })
  @IsString({ message: '[lng] não está definido como string.' })
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
  @IsString({ message: '[local] não está definido como string.' })
  @IsOptional()
  local?: string;

  @ApiProperty({
    default: 'Detalhes do local',
    examples: ['Detalhes do local', null],
    description: 'Detalhes sobre o ponto de embarque',
  })
  @IsString({
    message: '[details] O campo de detalhes deve ser do tipo string.',
  })
  @IsOptional()
  details?: string;

  @ApiProperty({
    default: 'Título do local',
    description: 'Título do local',
  })
  @IsString({ message: '[title] não está definido como string.' })
  @IsOptional()
  title?: string;
}
