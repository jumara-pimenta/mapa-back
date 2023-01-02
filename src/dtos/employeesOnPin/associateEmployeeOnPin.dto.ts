import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ETypePin } from '../../utils/ETypes';

export class AssociateEmployeeOnPinDTO {
  @ApiProperty({ default:'2e2b8886-5d93-4304-b00f-aa08e895865d',type:'UUID'})
  @IsUUID('4',{ message: 'EmployeeId não está definida como UUID.' })
  @IsNotEmpty({ message: 'EmployeeId não pode receber um valor vazio.' })
  employeeId: string;

  @ApiProperty({ default:'c0294d1c-5629-4969-90cb-36cc8596s5ae',type:'UUID'})
  @IsUUID('4',{ message: '[pinId] o pinId deve ser um UUID.' })
  @IsNotEmpty({ message: '[pinId] o pinId deve ser preenchido' })
  pinId: string;

  @ApiProperty({example:ETypePin.CONVENTIONAL, default:ETypePin.CONVENTIONAL,enum:ETypePin})
  @IsEnum(ETypePin, { message: '[type] O tipo do ponto de embarque deve ser do tipo enum: CONVENCIONAL | ESPECIAL' })
  @IsNotEmpty({ message: '[type] O tipo do ponto de embarque deve ser preenchido.' })
  type: ETypePin;
}
