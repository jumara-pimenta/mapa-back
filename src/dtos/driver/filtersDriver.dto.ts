import { ApiProperty } from "@nestjs/swagger";

export class FiltersDriverDTO {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  cpf?: string;
  @ApiProperty()
  cnh?: string;
  @ApiProperty()
  validation?: Date;
  @ApiProperty()
  category?: string;
}
