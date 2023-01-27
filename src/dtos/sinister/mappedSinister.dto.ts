import { ApiProperty } from '@nestjs/swagger';

export class MappedSinisterDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
}
