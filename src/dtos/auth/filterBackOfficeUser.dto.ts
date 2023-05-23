import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
export class FilterBackOfficeUserDTO {
  @ApiProperty({ required: false, example: `${faker.person.fullName}` })
  name?: string;

  @ApiProperty({
    required: false,
    example: `${faker.internet.email()}`,
  })
  email?: string;
  @ApiProperty({ required: false, example: `${faker.person.jobTitle()}` })
  role?: string;
}
