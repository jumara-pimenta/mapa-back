import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
