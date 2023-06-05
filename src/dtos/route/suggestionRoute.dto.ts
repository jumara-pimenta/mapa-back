import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

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

  duration: string;

  driver: string;

  vehicle: string;

  employeesIds: string[];

  time: string;

  distance: string;
}
