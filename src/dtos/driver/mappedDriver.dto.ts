import { ApiProperty } from "@nestjs/swagger";

export class MappedDriverDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  cnh: string;
  @ApiProperty()
  validation: Date;
  @ApiProperty()
  category: string;
  @ApiProperty()
  createdAt: Date;
}
