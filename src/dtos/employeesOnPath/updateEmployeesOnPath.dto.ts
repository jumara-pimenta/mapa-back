import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeesOnPathDTO {
  @IsBoolean({ message: '[confirmation] A confirmação deve ser do tipo booleano.'})
  @IsOptional()
  confirmation?: boolean;

  @IsDateString({}, { message: '[boardingAt] A data/hora do embarque deve ser do tipo date.'})
  @IsOptional()
  boardingAt?: Date;

  @IsDateString({}, { message: '[disembarkAt] A data/hora do desembarque deve ser do tipo date.'})
  @IsOptional()
  disembarkAt?: Date;

  @IsString({ message: '[description] A descrição deve ser do tipo string.'})
  @IsOptional()
  description?: string;
}
