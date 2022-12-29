import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ETypePath } from '../../utils/ETypes';
import { durationPathRgx } from '../../utils/Regex';

export class PathDetailsDTO {
  @IsEnum(ETypePath, { message: '[type] O tipo do trajeto deve ser do tipo enum: IDA | VOLTA | IDA E VOLTA'})
  @IsNotEmpty({ message: '[type] O tipo do trajeto deve ser preenchido.'})
  type: ETypePath;

  @IsDefined()
  @Matches(durationPathRgx, {
    message:
      '[duration] A duração do trajeto deve ser do formato: HH:MM',
  })
  duration: string;

  @IsDefined()
  @Matches(durationPathRgx, {
    message:
      '[startsAt] A hora de início do trajeto deve ser do formato: HH:MM',
  })
  startsAt: string;

  @IsBoolean({ message: '[isAutoRoute] A roteirização automática deve ser do tipo booleano.'})
  @IsNotEmpty({ message: '[isAutoRoute] A roteirização automática deve ser preenchida.'})
  isAutoRoute: boolean;
}
