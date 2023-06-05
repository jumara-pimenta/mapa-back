import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { SuggestionExtraDTO } from './suggestionRoute.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ETypePathExtra } from '../../utils/ETypes';

export class CreateSugestedRouteDTO {
  @ValidateNested({
    each: true,
  })
  @Type(() => SuggestionExtraDTO)
  suggestedExtras: SuggestionExtraDTO[];

  date: string;

  schedule: string;

  @ApiProperty({
    default: ETypePathExtra.ROUND_TRIP,
    enum: [ETypePathExtra.RETURN, ETypePathExtra.ROUND_TRIP],
    description: 'Tipo do trajeto',
  })
  @IsEnum(ETypePathExtra, {
    message:
      '[type] O tipo do trajeto deve ser do tipo enum: IDA | VOLTA | IDA E VOLTA',
  })
  @IsNotEmpty({ message: '[type] O tipo do trajeto deve ser preenchido.' })
  type: ETypePathExtra;
}
