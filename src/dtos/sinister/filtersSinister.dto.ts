import { ApiProperty } from '@nestjs/swagger';

export class FiltersSinisterDTO {
  @ApiProperty({ required: false })
  type?: string;
  @ApiProperty({ required: false })
  description?: string;
}
