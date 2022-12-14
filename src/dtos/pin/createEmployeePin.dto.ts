import {
  IsString,
  IsEnum,
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

  @IsString({ message: '[title] não está definido como string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '[lat] não está definido como string.' })
  @IsOptional()
  lat?: string;

  @IsString({ message: '[lng] não está definido como string.' })
  @IsOptional()
  lng?: string;

  @IsString({ message: '[street] não está definido como string.' })
  @IsOptional()
  street?: string;
}
