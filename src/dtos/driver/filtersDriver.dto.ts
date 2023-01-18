import { ApiProperty } from '@nestjs/swagger';

export class FiltersDriverDTO {
  @ApiProperty({required: false})
  name?: string;
  @ApiProperty({required: false})
  cpf?: string;
  @ApiProperty({required: false})
  cnh?: string;
  @ApiProperty({required: false})
  validation?: Date;
  @ApiProperty({required: false})
  category?: string;
}
