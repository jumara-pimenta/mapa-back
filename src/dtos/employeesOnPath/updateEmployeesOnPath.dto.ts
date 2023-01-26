import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeesOnPathDTO {
<<<<<<< HEAD
  @ApiProperty()
=======
  @ApiProperty({ description: 'Confirmação do Embarque do Colaborador' })
>>>>>>> 0229f9a750774d48dbf7982cd5e94eaf32e97165
  @IsBoolean({
    message: '[confirmation] A confirmação deve ser do tipo booleano.',
  })
  @IsOptional()
  confirmation?: boolean;

<<<<<<< HEAD
  @ApiProperty()
=======
  @ApiProperty({ description: 'Data/hora do embarque' })
>>>>>>> 0229f9a750774d48dbf7982cd5e94eaf32e97165
  @IsDateString(
    {},
    { message: '[boardingAt] A data/hora do embarque deve ser do tipo date.' },
  )
  @IsOptional()
  boardingAt?: Date;

<<<<<<< HEAD
  @ApiProperty()
=======
  @ApiProperty({ description: 'Data/hora do desembarque' })
>>>>>>> 0229f9a750774d48dbf7982cd5e94eaf32e97165
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

  @ApiProperty()
  @IsBoolean({ message: '[present] A presença deve ser do tipo booleano.' })
  @IsOptional()
  present?: boolean;
}
