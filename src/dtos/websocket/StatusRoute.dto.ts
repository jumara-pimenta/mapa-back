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
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  pathId: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRouteDTO)
  @IsNotEmpty({
    message: '[route] Os detalhes da rota devem ser preenchidos.',
  })
  route: UpdateRouteDTO;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePathDTO)
  @IsNotEmpty({
    message: '[path] Os detalhes do trajeto devem ser preenchidos.',
  })
  path: UpdatePathDTO;
}
