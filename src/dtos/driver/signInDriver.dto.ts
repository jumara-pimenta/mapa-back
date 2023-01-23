import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';

export class signInDriverDTO {
  @ApiProperty({ default: `${faker.random.numeric(6)}` })
  @IsString({ message: '[cpf] O cpf deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[cpf] O cpf deve ser preenchido.' })
  cpf: string;

  @ApiProperty({ default: `${faker.internet.password()}` })
  @IsString({ message: '[password] A senha deve ser do tipo texto.' })
  @IsNotEmpty({
    message: '[password] A senha deve ser preenchida.',
  })
  password: string;
}
