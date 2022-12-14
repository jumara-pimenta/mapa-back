import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEmployeesStatusOnPathDTO {
  @IsString()
  id: string;

  @IsBoolean()
  status: boolean;
}
