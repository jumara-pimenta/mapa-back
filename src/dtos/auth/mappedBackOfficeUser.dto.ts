import { ApiProperty } from '@nestjs/swagger';
import { ETypePin } from '../../utils/ETypes';

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
