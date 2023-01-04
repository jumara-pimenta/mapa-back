import {
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETypeCreationPin } from '../../utils/ETypes';
export class CreateEmployeePinDTO {
  @ApiProperty({examples: ['NOVO','EXISTENTE'],enum: ETypeCreationPin, default: ETypeCreationPin.IS_NEW})
  @IsEnum(ETypeCreationPin, {
    message: '[typeCreation] não está definido como enum.',
  })
  typeCreation: ETypeCreationPin;
  
  
  @ApiProperty({default:null,examples: [null,'74a7134e-5062-4dd8-9167-26dd0cc4e1b7'], description: 'caso typeCreation seja EXISTENTE\n\r\nId do pin que será atualizado.'})
  @IsString({ message: '[id] não está definido como string.' })
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
  @IsString({ message: '[details] não está definido como string.' })
  @IsOptional()
  details?: string;
  
  @ApiProperty({default: 'Título do local'})
  @IsString({ message: '[title] não está definido como string.' })
  @IsOptional()
  title?: string;
}
