import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePinDTO {
  @ApiProperty()
  @IsString({ message: '[lat] A latitude deve ser do tipo string.' })
  @IsOptional()
  lat?: string;

  @ApiProperty()
  @IsString({ message: '[lng] A longitude deve ser do tipo string.' })
  @IsOptional()
  lng?: string;

  @ApiProperty()
  @IsString({ message: '[local] O local deve ser do tipo string string.' })
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
