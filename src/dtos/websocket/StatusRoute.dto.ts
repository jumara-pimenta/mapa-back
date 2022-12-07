import { IsEnum, IsNotEmpty, IsOptional, IsString , isIdentityCard} from "class-validator";
import { EStatusPath, EStatusRoute } from "src/utils/ETypes";
import { UpdatePathDTO } from "../path/updatePath.dto";
import { UpdateRouteDTO } from "../route/updateRoute.dto";

export class StatusRouteDTO {
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsString()
  @IsNotEmpty()
  pathId: string 
  
  @IsOptional()
  route?: UpdateRouteDTO

  @IsOptional()
  path?: UpdatePathDTO




}