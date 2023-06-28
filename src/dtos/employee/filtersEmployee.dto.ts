import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';

export class FiltersEmployeeDTO {
  @ApiProperty({ required: false, example: `${faker.string.numeric(6)}` })
  registration?: string;
  @ApiProperty({
    required: false,
    example: `${faker.date.past().toISOString()}`,
  })
  admission?: string;
  @ApiProperty({ required: false, example: `${faker.person.jobTitle()}` })
  role?: string;
  @ApiProperty({
    required: false,
    example: `${faker.string.numeric({
      allowLeadingZeros: false,
      length: 1,
      exclude: ['0', '5', '6', '7', '8', '9'],
    })}`,
  })
  shift?: string;
  @ApiProperty({ required: false, example: `${faker.string.numeric(6)}` })
  costCenter?: string;
  @ApiProperty({ required: false, example: `${faker.person.firstName()}` })
  name?: string;
  @ApiProperty({ required: false, example: `${faker.person.firstName()}` })
  extra?: string;
}
