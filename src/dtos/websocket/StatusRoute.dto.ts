import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  isIdentityCard,
  ValidateNested,
} from 'class-validator';
import { EStatusPath, EStatusRoute } from 'src/utils/ETypes';
import { UpdatePathDTO } from '../path/updatePath.dto';
import { UpdateRouteDTO } from '../route/updateRoute.dto';

export class StatusRouteDTO {
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsString()
  @IsNotEmpty()
  pathId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRouteDTO)
  route?: UpdateRouteDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePathDTO)
  path?: UpdatePathDTO;
}
