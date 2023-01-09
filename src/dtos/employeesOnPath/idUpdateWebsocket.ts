import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class IdUpdateDTO {
  @IsNotEmpty({ message: '[id] O id deve ser preenchido.'})
  @IsString({ message: '[id] O id deve ser do tipo string.'})
  id: string;
}
