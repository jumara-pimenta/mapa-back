import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class CreateEmployeeFileDTO {
  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  registration: string;

  @IsNotEmpty({
    message: '[admission] A data de admissão deve ser preenchida.',
  })
  admission: Date;

  @ApiProperty({ default: `${faker.name.jobTitle()}` })
  @IsString({ message: '[role] O cargo deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O cargo deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;

  @ApiProperty({ default: `${faker.name.fullName()}` })
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsNotEmpty({ message: '[role] O nome deve ser preenchido.' })
  name: string;

  @ApiProperty({
    default: `${faker.random.numeric(1, {
      allowLeadingZeros: false,
      bannedDigits: ['0', '5', '6', '7', '8', '9'],
    })}`,
  })
  @IsString({ message: '[shift] O turno deve ser do tipo string.' })
  @IsNotEmpty({ message: '[shift] O turno deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shift: string;

  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({
    message: '[costCenter] O centro de custo deve ser do tipo string.',
  })
  @IsNotEmpty({
    message: '[costCenter] O centro de custo deve ser preenchido.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  costCenter: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '[address] O endereço deve ser preenchido.' })
  @ValidateNested({ each: true })
  address: string;
}
