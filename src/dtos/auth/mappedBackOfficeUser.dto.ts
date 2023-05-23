import { ApiProperty } from '@nestjs/swagger';

export class MappedBackOfficeUserDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  roleType: string;
  @ApiProperty()
  createdAt: Date;
}
