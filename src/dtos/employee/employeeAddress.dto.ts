import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class EmployeeAddressDTO {
  @ApiProperty({
    default: `${faker.location.zipCode('########')}`,
    description: 'CEP do endereço do colaborador',
  })
  @IsString({ message: '[cep] O cep deve ser do tipo alfanumérico.' })
  @IsNotEmpty({ message: '[cep] O cep deve ser preenchido.' })
  cep: string;

  @ApiProperty({
    default: `${faker.location.city()}`,
    description: 'Cidade do colaborador',
  })
  @IsString({ message: '[city] A cidade deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[city] A cidade deve ser preenchida.' })
  city: string;

  @ApiProperty({
    default: `${faker.location.street()}`,
    description: 'Complemento do endereço do colaborador',
  })
  @IsString({ message: '[complement] O complemento deve ser do tipo texto.' })
  @IsOptional()
  complement?: string;

  @ApiProperty({
    default: `${faker.location.street()}`,
    description: 'Bairro do endereço do colaborador',
  })
  @IsString({ message: '[neighborhood] O bairro deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[neighborhood] O bairro deve ser preenchido.' })
  neighborhood: string;

  @ApiProperty({
    default: `${faker.location.buildingNumber()}`,
    description: 'Número do endereço do colaborador',
  })
  @IsString({ message: '[number] O número deve ser do tipo texto.' })
  number: string;

  @ApiProperty({
    default: `${faker.location.state()}`,
    description: 'Estado do endereço do colaborador',
  })
  @IsString({ message: '[state] O estado deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[state] O estado deve ser preenchido.' })
  state: string;

  @ApiProperty({
    default: `${faker.location.street()}`,
    description: 'Rua do endereço do colaborador',
  })
  @IsString({ message: '[street] A rua deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[street] A rua deve ser preenchida.' })
  street: string;
}
