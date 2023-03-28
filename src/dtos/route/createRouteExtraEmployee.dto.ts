import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';

export class CreateRouteExtraEmployeeDTO {
    @ApiProperty({ description: 'Id dos funcionários que serão adicionados ao trajeto' })
    @IsNotEmpty({
        each : true,
        message: '[employeeIds] Os ids dos funcionários devem ser preenchidos.',
    })
    @IsString({
        each: true,
        message: '[employeeIds] O id do colaborador deve ser do tipo texto.',
      })
    @ArrayMinSize(2, {
        message: '[employeeIds] Deve ser informado ao menos dois ids de funcionário.',
        })
    employeeIds : string[]
}