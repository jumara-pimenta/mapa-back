import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePinDTO {
  @ApiProperty({ description: 'Latitude do Ponto de Embarque' })
  @IsString({ message: '[lat] A latitude deve ser do tipo texto.' })
  @IsOptional()
  lat?: string;

  @ApiProperty({ description: 'Longitude do Ponto de Embarque' })
  @IsString({ message: '[lng] A longitude deve ser do tipo texto.' })
  @IsOptional()
  lng?: string;

  @ApiProperty({ description: 'Local do Ponto de Embarque' })
  @IsString({ message: '[local] O local deve ser do tipo texto.' })
  @IsOptional()
  local?: string;

  @ApiProperty({ description: 'Detalhes do local do Ponto de Embarque' })
  @IsString({ message: '[details] O campo detalhes deve ser do tipo texto.' })
  @IsOptional()
  details?: string;

  @ApiProperty({ description: 'Título do Ponto de Embarque' })
  @IsString({ message: '[title] O título deve ser do tipo texto.' })
  @IsOptional()
  title?: string;
}
