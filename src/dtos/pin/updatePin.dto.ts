import { IsOptional, IsString } from 'class-validator';

export class UpdatePinDTO {
  @IsString({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsOptional()
  lat?: string;

  @IsString({ message: '[lng] A longitude deve ser do tipo string.' })
  @IsOptional()
  lng?: string;

  @IsString({ message: '[local] O local deve ser do tipo string string.' })
  @IsOptional()
  local?: string;

  @IsString({ message: '[details] O campo detalhes deve ser do tipo string.' })
  @IsOptional()
  details?: string;

  @IsString({ message: '[title] O título deve ser do tipo string.' })
  @IsOptional()
  title?: string;
}
