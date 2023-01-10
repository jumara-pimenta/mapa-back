import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, isBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';
export class EmployeeAddressDTO {

@ApiProperty({default: `${faker.address.zipCode('########')}`})
@IsString({ message: '[cep] O cep deve ser do tipo string.' })
@IsNotEmpty({ message: '[cep] O cep deve ser preenchido.'})
cep: string;
@ApiProperty({default: `${faker.address.city()}`})
@IsString({ message: '[city] A cidade deve ser do tipo string.'})
@IsNotEmpty({ message: '[city] A cidade deve ser preenchida.'})
city: string;
@ApiProperty({default: `${faker.address.streetName()}`})
@IsString({ message: '[complement] O complemento deve ser do tipo string.'})
@IsOptional()
complement?: string;
@ApiProperty({default: `${faker.address.streetName()}`})
@IsString({ message: '[neighborhood] O bairro deve ser do tipo string.'})
@IsNotEmpty({ message: '[neighborhood] O bairro deve ser preenchido.'})
neighborhood: string;
@ApiProperty({default: `${faker.address.buildingNumber()}`})
@IsString({ message: '[number] O número deve ser do tipo string.'})
@IsNotEmpty({ message: '[number] O número deve ser preenchido.'})
number: string;
@ApiProperty({default: `${faker.address.state()}`})
@IsString({ message: '[state] O estado deve ser do tipo string.'})
@IsNotEmpty({ message: '[state] O estado deve ser preenchido.'})
state: string;
@ApiProperty({default: `${faker.address.streetName()}`})
@IsString({ message: '[street] A rua deve ser do tipo string.'})
@IsNotEmpty({ message: '[street] A rua deve ser preenchida.'})
street: string;
}