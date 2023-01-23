import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { CreateEmployeePinDTO } from '../pin/createEmployeePin.dto';
import { EmployeeAddressDTO } from './employeeAddress.dto';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class SignInEmployeeDTO {
  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({ message: '[registration] A matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[registration] A matrícula deve ser preenchida.' })
  registration: string;

  @ApiProperty({ default: `${faker.internet.password()}` })
  @IsString({ message: '[password] A senha deve ser do tipo texto.' })
  @IsNotEmpty({
    message: '[password] A senha deve ser preenchida.',
  })
  password: string;
}
