import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { durationPathRgx } from '../../utils/Regex';

export class SuggestionExtraDTO {
  @ApiProperty({
    default: 'Rota 1',
    example: 'Rota 1',
    description: 'Descrição da rota',
  })
  @IsString({ message: '[description] A descrição deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[description] A descrição deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @IsNotEmpty({ message: '[duration] A duração da rota deve ser enviada.' })
  @Matches(durationPathRgx, {
    message: '[duration] O formato da duração deve ser HH:MM.',
  })
  duration: string;

  driver: string;

  vehicle: string;

  @IsString({ each: true, message: '[employeesIds] Os ids dos colaboradores devem ser do tipo texto.' })
  @IsNotEmpty({ each: true, message: '[employeesIds] Os ids dos colaboradores devem ser preenchidos.' })
  @Transform(({ value }) => value?.map((id: string) => id.trim()))
  employeesIds: string[];

  time: string;

  distance: string;
}
