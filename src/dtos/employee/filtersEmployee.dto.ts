import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

faker.locale = 'pt_BR';
export class FiltersEmployeeDTO {
  @ApiProperty({required: false, example: `${faker.random.numeric(6)}`})
  registration?: string;
  @ApiProperty({required: false, example: `${faker.date.past().toISOString()}`})
  admission?: Date;
  @ApiProperty({required: false, example: `${faker.name.jobTitle()}`})
  role?: string;
  @ApiProperty({required: false, example: `${faker.random.numeric(1,{allowLeadingZeros: false, bannedDigits: ['0','5','6','7','8','9']})}`})
  shift?: string;
  @ApiProperty({required: false, example: `${faker.random.numeric(6)}`})
  costCenter?: string;
  address?: string;
}
