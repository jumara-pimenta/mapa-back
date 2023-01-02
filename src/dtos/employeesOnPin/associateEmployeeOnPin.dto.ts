import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ETypePin } from '../../utils/ETypes';

export class AssociateEmployeeOnPinDTO {
  @ApiProperty()
  @IsString({ message: 'EmployeeId não está definida como string.' })
  @IsNotEmpty({ message: 'EmployeeId não pode receber um valor vazio.' })
  employeeId: string;

  @ApiProperty()
  @IsString({ message: 'PinId não está definida como string.' })
  @IsNotEmpty({ message: 'PinId não pode receber um valor vazio.' })
  pinId: string;

  @ApiProperty()
  @IsEnum(ETypePin, { message: 'Type não está definida como enum.' })
  @IsNotEmpty({ message: 'Type não pode receber um valor vazio.' })
  type: ETypePin;
}
