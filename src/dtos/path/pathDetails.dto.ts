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
  @IsEnum(ETypePath)
  @IsNotEmpty()
  type: ETypePath;

  @ApiProperty({ default: '01:30',example: '01:30' })
  @IsDefined()
  @Matches(durationPathRgx, {
    message:
      'O valor informado é inválido. O formato esperado é HH:MM (ex. 08:30)!',
  })
  duration: string;

  @ApiProperty({ default: '08:30',example: '08:30'})
  @IsDefined()
  @Matches(durationPathRgx)
  startsAt: string;

  @ApiProperty({ default: true,example: true })
  @IsBoolean()
  @IsNotEmpty()
  isAutoRoute: boolean;
}
