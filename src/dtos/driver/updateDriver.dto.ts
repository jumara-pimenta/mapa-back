import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ETypeCategoryDrivers } from '../../utils/ETypes';

export class UpdateDriverDTO {
  @ApiProperty({
    default: 'João da Silva',
    example: 'João da Silva',
    description: 'Nome do motorista',
  })
  @IsString({ message: '[Name] não está definida como texto.' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    default: '96893908563',
    example: '96893908563',
    description: 'CPF do motorista',
  })
  @IsString({ message: '[CPF] não está definida como alfanumérico.' })
  @IsOptional()
  cpf?: string;

  @ApiProperty({
    default: '123456789',
    example: '123456789',
    description: 'CNH do motorista',
  })
  @IsString({ message: '[CNH] não está definida como alfanumérico.' })
  @IsOptional()
  cnh?: string;

  @ApiProperty({
    default: new Date(),
    example: new Date(),
    description: 'Data de validade da CNH do motorista',
  })
  @IsDateString()
  @IsOptional()
  validation?: Date;

  @ApiProperty({
    default: 'D',
    example: 'D',
    description: 'Categoria da CNH do motorista',
  })
  @IsEnum(ETypeCategoryDrivers, {
    message: '[Category] Categoria tem que ser do tipo C, D ou E.',
  })
  @IsOptional()
  category?: ETypeCategoryDrivers;
}
