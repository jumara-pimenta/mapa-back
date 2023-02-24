import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ETypePin } from '../../utils/ETypes';

export class AssociateEmployeeOnPinDTO {
  @ApiProperty({
    default: '2e2b8886-5d93-4304-b00f-aa08e895865d',
    type: 'UUID',
    description: 'Id do colaborador',
  })
  @IsUUID('4', { message: 'ID do colaborador não está definida como UUID.' })
  @IsNotEmpty({ message: 'ID do colaborador não pode receber um valor vazio.' })
  employeeId: string;

  @ApiProperty({
    default: 'c0294d1c-5629-4969-90cb-36cc8596s5ae',
    type: 'UUID',
    description: 'Id do ponto de embarque',
  })
  @IsUUID('4', { message: '[pinId] o Id do ponto de embarque deve ser um UUID.' })
  @IsNotEmpty({ message: '[pinId] o Id do ponto de embarque deve ser preenchido' })
  pinId: string;

  @ApiProperty({
    example: ETypePin.CONVENTIONAL,
    default: ETypePin.CONVENTIONAL,
    enum: ETypePin,
    description: 'Tipo do ponto de embarque',
  })
  @IsEnum(ETypePin, {
    message:
      '[type] O tipo do ponto de embarque deve ser do tipo enum: CONVENCIONAL | ESPECIAL',
  })
  @IsNotEmpty({
    message: '[type] O tipo do ponto de embarque deve ser preenchido.',
  })
  type: ETypePin;
}
