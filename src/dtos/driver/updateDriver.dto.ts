import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDriverDTO {
  @ApiProperty()
  @IsString({ message: '[Name] não está definida como string.' })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString({ message: '[CPF] não está definida como string.' })
  @IsOptional()
  cpf?: string;

  @ApiProperty()
  @IsString({ message: '[CNH] não está definida como string.' })
  @IsOptional()
  cnh?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  validation?: Date;

  @ApiProperty()
  @IsString({ message: '[Category] não está definida como string.' })
  @IsOptional()
  category?: string;
}
