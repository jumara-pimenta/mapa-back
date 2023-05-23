import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class signInDriverDTO {
  @ApiProperty({
    default: `${faker.string.numeric(11)}`,
    description: '[login] cpf para fazer o login',
  })
  @IsString({ message: '[login] O login:cpf deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[login] O login:cpf deve ser preenchido.' })
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
