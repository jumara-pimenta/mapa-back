import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ECreatePin } from 'src/utils/ETypes';

export class CreateEmployeePinDTO {
  @IsEnum(ECreatePin, {
    message: '[typeCreation] não está definido como enum.',
  })
  typeCreation: ECreatePin;

  @IsString({ message: '[id] não está definido como string.' })
  @IsOptional()
  id?: string;

  @IsString({ message: '[description] não está definido como string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '[lat] não está definido como string.' })
  @IsOptional()
  lat?: string;

  @IsString({ message: '[long] não está definido como string.' })
  @IsOptional()
  long?: string;

  @IsString({ message: '[street] não está definido como string.' })
  @IsOptional()
  street?: string;
}
