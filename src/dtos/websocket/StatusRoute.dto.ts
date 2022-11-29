import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EStatusPath, EStatusRoute } from "src/utils/ETypes";
import { UpdatePathDTO } from "../path/updatePath.dto";
import { UpdateRouteDTO } from "../route/updateRoute.dto";

export class StatusRouteDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  route?: UpdateRouteDTO

  @IsOptional()
  path?: UpdatePathDTO

}