import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CoreTokenDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9jb2RlIjoiMDIwMTAwMTAyNSIsImlhdCI6MTY3NDIyNDUwMCwiZXhwIjoxNjc0MzEwOTAwLCJpc3MiOiJudWNsZW8tYXBpIn0.LXsHSLfE43syBet3lEEb1B4uPxLMsJW8aTSpCtGKE5DUrmIyWKiNz9RW98c8ZySAz0aq5Ins9bcViADARhAGmQ',
  })
  @IsNotEmpty({ message: '[token] o token é obrigatório' })
  @IsString({ message: '[token] o token deve ser do tipo texto' })
  token: string;
}
