import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ETypeCreationPin } from '../../utils/ETypes';

export class CreateEmployeePinDTO {
  @ApiProperty({examples: ['NOVO','EXISTENTE'],enum: ETypeCreationPin, default: ETypeCreationPin.IS_NEW})
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
  
  @ApiProperty({ default: '-3.10719',examples: ['-3.10719', null]})
  @IsString({ message: '[lat] não está definido como string.' })
  @IsOptional()
  lat?: string;
  
  @ApiProperty({default: '-60.0261', examples: ['-60.0261', null]})
  @IsString({ message: '[lng] não está definido como string.' })
  @IsOptional()
  lng?: string;
  
  @ApiProperty({default: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',examples: ['Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil', null]})
  @IsString({ message: '[local] não está definido como string.' })
  @IsOptional()
  local?: string;
  
  @ApiProperty({default: 'Detalhes do local',examples: ['Detalhes do local', null]})
  @IsString({
    message: '[details] O campo de detalhes deve ser do tipo string.',
  })
  @IsOptional()
  details?: string;
  
  @ApiProperty({default: 'Título do local'})
  @IsString({ message: '[title] não está definido como string.' })
  @IsOptional()
  title?: string;
}
