import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ETypePeriodHistory } from 'src/utils/ETypes';

export class PeriodInDate {
  dateInitial: Date;
  dateFinal: Date;
}
export class DateFilterDTO {
  @ApiProperty({
    default: ETypePeriodHistory.WEEKLY,
    enum: [
      ETypePeriodHistory.WEEKLY,
      ETypePeriodHistory.BIWEEKLY,
      ETypePeriodHistory.MONTHLY,
    ],
    description: 'Tipo do período: Semanal, Quinzenal ou Mensal',
  })
  @IsEnum(ETypePeriodHistory, {
    message:
      '[period] O PERIOD tem que ser do tipo: SEMANAL, QUINZENAL Ou MENSAL',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: '[period] O PERIOD não pode ser vazio.',
  })
  period: ETypePeriodHistory;
}
