import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsDefined,
  IsOptional,
  Matches,
} from 'class-validator';
import { PathDetailsDTO } from '../path/pathDetails.dto';
import { ETypeRoute, ETypeShiftRotue } from '../../utils/ETypes';
import { StartsAtRgx, durationPathRgx } from 'src/utils/Regex';

export class CreateSugestedRouteDTO {
  @ValidateNested({
    each: true,
  })
  @Type(() => suggestedExtrasDTO)
  suggestedExtras: suggestedExtrasDTO[];
}

class suggestedExtrasDTO {
  @ApiProperty({
    default: 'Rota 1',
    example: 'Rota 1',
    description: 'Descrição da rota',
  })
  @IsString({ message: '[description] A descrição deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[description] A descrição deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  driver: string;
  vehicle: string;
  employeesIds: string[];
  time: string;
  distance: string;

  duration: string;
}
