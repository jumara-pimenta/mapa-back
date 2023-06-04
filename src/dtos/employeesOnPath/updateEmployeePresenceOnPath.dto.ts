import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateEmployeePresenceOnPathDTO {
  @ApiProperty({
    description: '[confirmation] Confirmação do colaborador no trajeto.',
  })
  @IsBoolean({
    message: '[confirmation] A confirmação deve ser do tipo booleano.',
  })
  confirmation: boolean;
}
