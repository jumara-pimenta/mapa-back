import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CurrentLocalDTO {
  @ApiProperty()
  @IsString({ message: '[id] O id deve ser do tipo string.'})
  @IsNotEmpty({ message: '[id] O id deve ser preenchido.'})
  id: string;
  
  @ApiProperty()
  @IsString({ message: '[message] A mensagem deve ser do tipo string.'})
  @IsNotEmpty({ message: '[message] A mensagem deve ser preenchida.'})
  message: string;
  
  @ApiProperty()
  @IsString({ message: '[driverId] O id do motorista deve ser do tipo string.'})
  @IsNotEmpty({ message: '[driverId] O id do motorista deve ser preenchido.'})
  driverId: string;
  
  @ApiProperty()
  @IsString({ message: '[lat] A latitude deve ser do tipo string.'})
  @IsNotEmpty({ message: '[lat] A latitude deve ser preenchida.'})
  lat: string;
  
  @ApiProperty()
  @IsString({ message: '[lng] A longitude deve ser do tipo string.'})
  @IsNotEmpty({ message: '[lng] A longitude deve ser preenchida.'})
  lng: string;
}
