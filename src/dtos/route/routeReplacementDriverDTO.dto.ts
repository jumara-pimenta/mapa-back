import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RouteReplacementDriverDTO {
  @ApiProperty({
    default: '05e7ce8b-b3e2-4295-b584-8e2caae2d809',
    description: 'Id da rota',
  })
  @IsString({ message: '[routeId1] não está definida como texto.' })
  @IsNotEmpty({ message: '[routeId1] não pode receber um valor vazio.' })
  routeId1: string;

  @ApiProperty({
    default: '41b4eb3d-e18a-4c8e-a668-49824b21579c',
    description: 'Id do veículo',
  })
  @IsString({ message: '[routeId2] não está definida como texto.' })
  @IsNotEmpty({ message: '[routeId2] não pode receber um valor vazio.' })
  routeId2: string;
}
