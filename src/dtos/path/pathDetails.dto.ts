import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ default: ETypePath.ROUND_TRIP, enum: [ETypePath.ONE_WAY, ETypePath.RETURN, ETypePath.ROUND_TRIP] })
  @IsEnum(ETypePath, { message: '[type] O tipo do trajeto deve ser do tipo enum: IDA | VOLTA | IDA E VOLTA'})
  @IsNotEmpty({ message: '[type] O tipo do trajeto deve ser preenchido.'})
  type: ETypePath;

  @ApiProperty({ default: '01:30',example: '01:30' })
  @IsDefined()
  @Matches(durationPathRgx, {
    message:
      '[duration] A duração do trajeto deve ser do formato: HH:MM',
  })
  duration: string;

  @ApiProperty({ default: '08:30',example: '08:30'})
  @IsDefined()
  @Matches(durationPathRgx, {
    message:
      '[startsAt] A hora de início do trajeto deve ser do formato: HH:MM',
  })
  startsAt: string;

  @ApiProperty({ default: true,example: true })
  @IsBoolean({ message: '[isAutoRoute] A roteirização automática deve ser do tipo booleano.'})
  @IsNotEmpty({ message: '[isAutoRoute] A roteirização automática deve ser preenchida.'})
  isAutoRoute: boolean;
}
