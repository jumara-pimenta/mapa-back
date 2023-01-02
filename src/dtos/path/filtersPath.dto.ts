import { ApiProperty } from '@nestjs/swagger';
import { EStatusPath, ETypePath } from '../../utils/ETypes';

export class FiltersPathDTO {
  @ApiProperty()
  status?: EStatusPath;
  @ApiProperty()
  duration?: string;
  @ApiProperty()
  finishedAt?: Date;
  @ApiProperty()
  startedAt?: string;
  @ApiProperty()
  startsAt?: string;
  @ApiProperty()
  type?: ETypePath;
}
