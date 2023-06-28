import { IsNotEmpty, IsString } from 'class-validator';

export class DisembarkEmployeeDTO {
  @IsNotEmpty({ message: '[id] O id deve ser preenchido.' })
  @IsString({ message: '[id] O id deve ser do tipo string.' })
  id: string;
}
