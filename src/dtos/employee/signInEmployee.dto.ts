import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class SignInEmployeeDTO {
  @ApiProperty({
    default: `${faker.random.numeric(6)}`,
    description: '[login] O login:matrícula para fazer o login',
  })
  @IsString({ message: '[login] O login:matrícula deve ser do tipo string.' })
  @IsNotEmpty({ message: '[login] O login:matrícula deve ser preenchida.' })
  login: string;

  @ApiProperty({
    default: `${faker.internet.password()}`,
    description: '[password]  para fazer o login',
  })
  @IsString({ message: '[password] A senha deve ser do tipo texto.' })
  @IsNotEmpty({
    message: '[password] A senha deve ser preenchida.',
  })
  password: string;
}
