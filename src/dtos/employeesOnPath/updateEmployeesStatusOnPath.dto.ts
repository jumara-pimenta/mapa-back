import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateEmployeesStatusOnPathDTO {
  @ApiProperty()
  @IsNotEmpty({ message: '[id] O id deve ser preenchido.'})
  @IsString({ message: '[id] O id deve ser do tipo string.'})
  id: string;
  
  @ApiProperty()
  @IsBoolean({ message: '[status] O status deve ser do tipo booleano.'})
  status: boolean;
}
