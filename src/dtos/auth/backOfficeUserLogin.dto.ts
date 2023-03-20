import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class BackOfficeUserDTO {
  @ApiProperty({ example: faker.internet.email() })
  @IsEmail({}, { message: '[email] o Email deve ser válido' })
  @IsNotEmpty({ message: '[email] o Email é obrigatório' })
  email: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsString({ message: '[password] a senha deve ser alfanumérico' })
  @IsNotEmpty({ message: '[password] a Senha é obrigatória' })
  password: string;
}

export class BackOfficeUserCreateDTO {
  @ApiProperty({ example: faker.internet.email() })
  @IsEmail({}, { message: '[email] o Email deve ser válido' })
  @IsNotEmpty({ message: '[email] o Email é obrigatório' })
  email: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsString({ message: '[password] a senha deve ser alfanumérico' })
  @IsNotEmpty({ message: '[password] a Senha é obrigatória' })
  password: string;

  @ApiProperty({ example: faker.name.fullName() })
  @IsString({ message: '[name] o nome deve ser do tipo texto' })
  @IsNotEmpty({ message: '[name] o Nome é obrigatório' })
  name: string;

  @ApiProperty({ example: faker.name.jobTitle() })
  @IsString({ message: '[role] a função deve ser do tipo texto' })
  @IsNotEmpty({ message: '[role] a Função é obrigatória' })
  role: string;
}

export class BackOfficeUserUpdateDTO {
  @ApiProperty({ example: faker.internet.email() })
  @IsOptional()
  @IsEmail({}, { message: '[email] o Email deve ser válido' })
  email?: string;

  @ApiProperty({ example: faker.name.fullName() })
  @IsOptional()
  @IsString({ message: '[name] o nome deve ser do tipo texto' })
  name?: string;

  @ApiProperty({ example: faker.name.jobTitle() })
  @IsOptional()
  @IsString({ message: '[role] a função deve ser do tipo texto' })
  role?: string;

  @ApiProperty({ example: faker.internet.password() })
  @IsOptional()
  @IsString({ message: '[password] a senha deve ser alfanumérico' })
  password?: string;
}
