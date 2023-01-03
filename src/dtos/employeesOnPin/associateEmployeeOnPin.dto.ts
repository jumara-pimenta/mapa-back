import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ETypePin } from '../../utils/ETypes';

export class AssociateEmployeeOnPinDTO {
  @ApiProperty({ default:'2e2b8886-5d93-4304-b00f-aa08e895865d',type:'UUID'})
  @IsUUID('4',{ message: 'EmployeeId não está definida como UUID.' })
  @IsNotEmpty({ message: 'EmployeeId não pode receber um valor vazio.' })
  employeeId: string;

  @ApiProperty({ default:'c0294d1c-5629-4969-90cb-36cc8596s5ae',type:'UUID'})
  @IsUUID('4',{ message: 'PinId não está definida como UUID.' })
  @IsNotEmpty({ message: 'PinId não pode receber um valor vazio.' })
  pinId: string;

  @ApiProperty({example:ETypePin.CONVENTIONAL, default:ETypePin.CONVENTIONAL,enum:ETypePin})
  @IsEnum(ETypePin, { message: 'Type não está definida como enum.' })
  @IsNotEmpty({ message: 'Type não pode receber um valor vazio.' })
  type: ETypePin;
}
