import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ETypeEditionPin } from 'src/utils/ETypes';

export class UpdateEmployeePinDTO {
  @IsString({ message: '[id] O id do ponto de embarque deve ser do tipo string.' })
  @IsOptional()
  id?: string;

  @ApiProperty({examples: ['NOVO','EXISTENTE'],enum: ETypeEditionPin, default: ETypeEditionPin.IS_NEW})
  @IsEnum(ETypeEditionPin, {
    message: '[typeCreation] O tipo de edição deve ser do tipo enum: NOVO | EXISTENTE.',
  })
  @IsNotEmpty({ message: '[typeCreation] O tipo de edição deve ser preenchido.', })
  typeEdition: ETypeEditionPin;

  @ApiProperty()
  @IsString({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsOptional()
  lat?: string;

  @ApiProperty()
  @IsString({ message: '[lng] A longitude deve ser do tipo string.' })
  @IsOptional()
  lng?: string;

  @ApiProperty()
  @IsString({ message: '[local] O local deve ser do tipo string.' })
  @IsOptional()
  local?: string;

  @ApiProperty()
  @IsString({ message: '[details] O campo detalhes deve ser do tipo string.' })
  @IsOptional()
  details?: string;

  @ApiProperty()
  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsOptional()
  title?: string;
}
