import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { CreateRouteDTO } from './createRoute.dto';

export class CreateRouteExtraDTO {

    @ApiProperty({ description: 'Detalhes do trajeto' })
    @ValidateNested({
      each: true,
    })
    @Type(() => CreateRouteDTO)
    @IsNotEmpty({
      message: '[routes] Os detalhes dos trajetos devem ser preenchidos.',
    })
    routes : CreateRouteDTO[]
}

