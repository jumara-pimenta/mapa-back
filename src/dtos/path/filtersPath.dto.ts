import { ApiProperty } from '@nestjs/swagger';
import { EStatusPath, ETypePath } from '../../utils/ETypes';

export class FiltersPathDTO {
  @ApiProperty({required: false})
  status?: EStatusPath;
  @ApiProperty({required: false})
  duration?: string;
  @ApiProperty({required: false})
  finishedAt?: Date;
  @ApiProperty({required: false})
  startedAt?: string;
  @ApiProperty({required: false})
  startsAt?: string;
  @ApiProperty({required: false})
  type?: ETypePath;
}
