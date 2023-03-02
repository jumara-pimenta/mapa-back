import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString({ message: '[routeId] O id da rota deve ser do tipo texto.' })
  @IsOptional({ message: '[routeId] O id da rota deve ser preenchida.' })
  routeId?: string;

  @ApiProperty()
  @IsString({ message: '[pathId] O id do trajeto deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[pathId] O id do trajeto deve ser preenchida.' })
  pathId: string;

  @ApiProperty()
  @ValidateNested({
    each: true,
  })
  @Type(() => UpdateRouteDTO)
  @IsOptional({
    message: '[route] Os detalhes da rota devem ser preenchidos.',
  })
  route?: UpdateRouteDTO;

  @ApiProperty()
  @ValidateNested({
    each: true,
  })
  @Type(() => UpdatePathDTO)
  @IsOptional({
    message: '[path] Os detalhes do trajeto devem ser preenchidos.',
  })
  path?: UpdatePathDTO;
}
