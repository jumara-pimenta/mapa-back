import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatusRoute, ETypeRoute } from '../../utils/ETypes';

export class UpdateRouteDTO {
  @ApiProperty()
  @IsString({ message: '[Description] não está definida como string.' })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString({ message: '[Distance] não está definida como string.' })
  @IsOptional()
  distance?: string;

  @ApiProperty()
  @IsEnum(ETypeRoute, { message: '[Type] não está definida como enum.' })
  @IsOptional()
  type?: ETypeRoute;

  @ApiProperty()
  @IsEnum(EStatusRoute, { message: '[Status] não está definida como enum.' })
  @IsOptional()
  status?: EStatusRoute;

  @ApiProperty()
  @IsString({ message: '[DriverId] não está definida como string.' })
  @IsOptional()
  driverId?: string;

  @ApiProperty()
  @IsString({ message: '[VehicleId] não está definida como string.' })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty()
  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo string.',
  })
  @IsOptional()
  employeeIds?: string[];
}
