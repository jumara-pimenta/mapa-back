import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateEmployeesStatusOnPathDTO {
  @IsString({ message: '[id] O id deve ser do tipo string.'})
  @IsNotEmpty({ message: '[id] O id deve ser preenchido.'})
  id: string;

  @IsBoolean({ message: '[status] O status deve ser do tipo booleano.'})
  @IsNotEmpty({ message: '[status] O status deve ser preenchido.'})
  status: boolean;
}
