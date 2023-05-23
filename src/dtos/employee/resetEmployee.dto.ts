import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class resetEmployeePasswordDTO {
  @ApiProperty({ default: `${faker.string.numeric(6)}` })
  @IsNumberString(
    {},
    { message: '[registration] A matrícula deve ser do tipo texto.' },
  )
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;
}
