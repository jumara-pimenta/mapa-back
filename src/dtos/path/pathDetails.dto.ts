import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { ETypePath } from '../../utils/ETypes';
import { durationPathRgx, StartsAtRgx } from '../../utils/Regex';

export class PathDetailsDTO {
  @ApiProperty({
    default: ETypePath.ROUND_TRIP,
    enum: [ETypePath.ONE_WAY, ETypePath.RETURN, ETypePath.ROUND_TRIP],
    description: 'Tipo do trajeto',
  })
  @IsEnum(ETypePath, {
    message:
      '[type] O tipo do trajeto deve ser do tipo enum: IDA | VOLTA | IDA E VOLTA',
  })
  @IsNotEmpty({ message: '[type] O tipo do trajeto deve ser preenchido.' })
  type: ETypePath;

  @ApiProperty({
    default: '01:30',
    example: '01:30',
    description: 'Tempo de duração do trajeto',
  })
  @IsDefined()
  @IsNotEmpty({ message: '[duration] A duração da rota deve ser enviada.' })
  @Matches(durationPathRgx, {
    message: '[duration] O formato da duração deve ser HH:MM.',
  })
  duration: string;

  @ApiProperty({
    default: '08:30',
    example: '08:30',
    description: 'Hora de início do trajeto',
  })
  @IsOptional()
  @Matches(StartsAtRgx, {
    message: '[startsAt] A hora de início tem que estar entre 00:00 e 23:59',
  })
  startsAt?: string;

  @ApiProperty({
    default: '08:30',
    example: '08:30',
    description: 'Hora de início da volta do trajeto',
    required: false,
  })
  @Matches(durationPathRgx, {
    message:
      '[startsReturnAt] A hora de início do retorno do trajeto deve ser entre 00:00 e 23:59',
  })
  @IsOptional()
  startsReturnAt?: string;

  @ApiProperty({
    default: true,
    example: true,
    description: 'Roteirização automáticado trajeto',
  })
  @IsBoolean({
    message:
      '[isAutoRoute] A roteirização automática deve ser do tipo booleano.',
  })
  @IsNotEmpty({
    message: '[isAutoRoute] A roteirização automática deve ser preenchida.',
  })
  isAutoRoute: boolean;

  @ApiProperty({
    default: '08:30',
    example: '08:30',
    description: 'Hora de início do trajeto Espeical',
    required: false,
  })
  @Matches(durationPathRgx, {
    message:
      '[backTime] A hora de início do retorno do trajeto deve ser entre 00:00 e 23:59',
  })
  @IsOptional()
  backTime?: string;

  @ApiProperty({
    default: '08:30',
    example: '08:30',
    description: 'Hora de início da volta do trajeto',
    required: false,
  })
  @Matches(durationPathRgx, {
    message:
      '[departureTime] A hora de início da partida do trajeto deve ser entre 00:00 e 23:59',
  })
  @IsOptional()
  departureTime?: string;

  scheduleDate?: Date;
}
