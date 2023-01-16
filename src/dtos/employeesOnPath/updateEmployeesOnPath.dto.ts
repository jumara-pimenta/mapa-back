import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeesOnPathDTO {
  @ApiProperty({ description: 'Confirmação do Embarque do Colaborador' })
  @IsBoolean({
    message: '[confirmation] A confirmação deve ser do tipo booleano.',
  })
  @IsOptional()
  confirmation?: boolean;

  @ApiProperty({ description: 'Data/hora do embarque' })
  @IsDateString(
    {},
    { message: '[boardingAt] A data/hora do embarque deve ser do tipo date.' },
  )
  @IsOptional()
  boardingAt?: Date;

  @ApiProperty({ description: 'Data/hora do desembarque' })
  @IsDateString(
    {},
    {
      message:
        '[disembarkAt] A data/hora do desembarque deve ser do tipo date.',
    },
  )
  @IsOptional()
  disembarkAt?: Date;

  @ApiProperty({ description: 'Descrição' })
  @IsString()
  @IsOptional()
  description?: string;
}
