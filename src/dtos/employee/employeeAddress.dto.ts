import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, isBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EmployeeAddressDTO {

@ApiProperty()
@IsString({ message: '[cep] O cep deve ser do tipo string.' })
@IsNotEmpty({ message: '[cep] O cep deve ser preenchido.'})
cep: string;
@ApiProperty()
@IsString({ message: '[city] A cidade deve ser do tipo string.'})
@IsNotEmpty({ message: '[city] A cidade deve ser preenchida.'})
city: string;
@ApiProperty()
@IsString({ message: '[complement] O complemento deve ser do tipo string.'})
@IsOptional()
complement?: string;
@ApiProperty()
@IsString({ message: '[neighborhood] O bairro deve ser do tipo string.'})
@IsNotEmpty({ message: '[neighborhood] O bairro deve ser preenchido.'})
neighborhood: string;
@ApiProperty()
@IsString({ message: '[number] O número deve ser do tipo string.'})
@IsNotEmpty({ message: '[number] O número deve ser preenchido.'})
number: string;
@ApiProperty()
@IsString({ message: '[state] O estado deve ser do tipo string.'})
@IsNotEmpty({ message: '[state] O estado deve ser preenchido.'})
state: string;
@ApiProperty()
@IsString({ message: '[street] A rua deve ser do tipo string.'})
@IsNotEmpty({ message: '[street] A rua deve ser preenchida.'})
street: string;
@ApiProperty()
@IsBoolean({ message: '[type] O tipo deve ser do tipo booleano.'})
@IsNotEmpty({ message: '[type] O tipo deve ser preenchido.'})
type: boolean;
}