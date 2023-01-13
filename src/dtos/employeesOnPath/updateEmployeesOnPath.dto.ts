import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmployeesOnPathDTO {
  @ApiProperty()
  @IsBoolean({
    message: '[confirmation] A confirmação deve ser do tipo booleano.',
  })
  @IsOptional()
  confirmation?: boolean;

  @ApiProperty()
  @IsDateString(
    {},
    { message: '[boardingAt] A data/hora do embarque deve ser do tipo date.' },
  )
  @IsOptional()
  boardingAt?: Date;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message:
        '[disembarkAt] A data/hora do desembarque deve ser do tipo date.',
    },
  )
  @IsOptional()
  disembarkAt?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsBoolean({ message: '[present] A presença deve ser do tipo booleano.' })
  @IsOptional()
  present?: boolean;
}
