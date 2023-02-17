import { IsDateString, IsEnum, IsOptional, Matches } from 'class-validator';
import { DurationRgx, StartsAtRgx } from '../../utils/Regex';
import { EStatusPath } from '../../utils/ETypes';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePathDTO {
  @ApiProperty({ description: 'Tempo de duração do trajeto' })
  @Matches(DurationRgx, {
    message:
      '[duration] O tempo de duração do trajeto deve ser do formato esperado: 00h00',
  })
  @ApiProperty()
  @IsOptional()
  duration?: string;

  @ApiProperty({ description: 'Hora prevista para início do trajeto' })
  @Matches(StartsAtRgx, {
    message:
      '[startsAt] A hora de início do trajeto deve ser do formato esperado: 00h00',
  })
  @IsOptional()
  startsAt?: string;

  @ApiProperty({ description: 'Hora prevista para ida do trajeto' })
  @Matches(StartsAtRgx, {
    message:
      '[startsReturnAt] A hora de ida do trajeto deve ser do formato esperado: 00h00',
  })
  @IsOptional()
  startsReturnAt?: string;

  @ApiProperty({ description: 'Hora do início do trajeto' })
  @IsDateString()
  @IsOptional()
  startedAt?: Date;

  @ApiProperty({ description: 'Status do trajeto' })
  @IsEnum(EStatusPath, {
    message:
      '[status] O status do trajeto deve ser do formato esperado: PENDENTE | EM ANDAMENTO | FINALIZADO',
  })
  @IsOptional()
  status?: EStatusPath;

  @ApiProperty({
    description: 'id do Motorista substituto',
    required: false,
    type: String,
  })
  @IsOptional()
  substituteId?: string;
}
