import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateEmployeePinDTO {
  @ApiProperty()
  @IsString({ message: '[id] O id do ponto de embarque deve ser do tipo string.' })
  @IsNotEmpty({ message: '[id] O id do ponto de embarque deve ser enviado.'})
  id?: string;

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
