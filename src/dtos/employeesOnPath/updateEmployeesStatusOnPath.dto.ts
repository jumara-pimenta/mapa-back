import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateEmployeesStatusOnPathDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
