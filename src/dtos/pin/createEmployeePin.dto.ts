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

  @IsString({ message: '[lat] não está definido como string.' })
  @IsOptional()
  lat?: string;

  @IsString({ message: '[lng] não está definido como string.' })
  @IsOptional()
  lng?: string;

  @IsString({ message: '[local] não está definido como string.' })
  @IsOptional()
  local?: string;

  @IsString({ message: '[details] não está definido como string.' })
  @IsOptional()
  details?: string;

  @IsString({ message: '[title] não está definido como string.' })
  @IsOptional()
  title?: string;
}
