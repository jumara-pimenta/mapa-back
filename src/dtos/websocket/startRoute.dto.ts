import {
  IsNotEmpty,
  IsString,
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

  @IsNotEmpty()
  route: UpdateRouteDTO;

  @IsNotEmpty()
  path: UpdatePathDTO;
}
