import { IsDateString, IsEnum, IsOptional, Matches } from 'class-validator';
import { DurationRgx, StartsAtRgx } from '../../utils/Regex';
import { EStatusPath } from '../../utils/ETypes';

export class UpdatePathDTO {
  @Matches(DurationRgx, {
    message:
      '[duration] O tempo de duração do trajeto deve ser do formato esperado: 00h00',
  })
  @IsOptional()
  duration?: string;

  @Matches(StartsAtRgx, {
    message:
      '[startsAt] A hora de início do trajeto deve ser do formato esperado: 00h00',
  })
  @IsOptional()
  startsAt?: string;

  @IsDateString()
  @IsOptional()
  startedAt?: Date;

  @IsEnum(EStatusPath, {
    message:
      '[status] O status do trajeto deve ser do formato esperado: PENDENTE | EM ANDAMENTO | FINALIZADO',
  })
  @IsOptional()
  status?: EStatusPath;
}
