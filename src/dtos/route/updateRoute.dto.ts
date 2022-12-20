import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatusRoute, ETypeRoute } from '../../utils/ETypes';

export class UpdateRouteDTO {
  @IsString({ message: '[Description] não está definida como string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: '[Distance] não está definida como string.' })
  @IsOptional()
  distance?: string;

  @IsEnum(ETypeRoute, { message: '[Type] não está definida como enum.' })
  @IsOptional()
  type?: ETypeRoute;

  @IsEnum(EStatusRoute, { message: '[Status] não está definida como enum.' })
  @IsOptional()
  status?: EStatusRoute;

  @IsString({ message: '[DriverId] não está definida como string.' })
  @IsOptional()
  driverId?: string;

  @IsString({ message: '[VehicleId] não está definida como string.' })
  @IsOptional()
  vehicleId?: string;

  @IsString({
    each: true,
    message: '[EmployeeIds] não está definida como string.',
  })
  @IsOptional()
  employeeIds?: string[];
}
