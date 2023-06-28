import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ETypePathExtra } from '../../utils/ETypes';
import { durationPathRgx } from '../../utils/Regex';

export class CreateRouteExtraEmployeeDTO {
  @ApiProperty({
    description: 'Id dos funcionários que serão adicionados ao trajeto',
  })
  @IsNotEmpty({
    each: true,
    message: '[employeeIds] Os ids dos funcionários devem ser preenchidos.',
  })
  @IsString({
    each: true,
    message: '[employeeIds] O id do colaborador deve ser do tipo texto.',
  })
  @ArrayMinSize(2, {
    message:
      '[employeeIds] Deve ser informado ao menos dois ids de funcionário.',
  })
  employeeIds: string[];
  
  @IsEnum(ETypePathExtra, {
    message:
      '[typeShift] O tipo da rota deve ser do tipo VOLTA ou IDA E VOLTA.',
  })
  type: ETypePathExtra;

  @IsNotEmpty({ message: '[duration] A duração da rota deve ser enviada.' })
  @Matches(durationPathRgx, { message: '[duration] O formato da duração deve ser HH:MM.'})
  duration: string;

  schedule?: boolean;

  date?: string;
}
