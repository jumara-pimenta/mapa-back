import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { durationPathRgx } from '../../utils/Regex';

export class CreateRouteHistoryDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({
    default: 'Convencional',
    example: 'Convencional',
    description: 'Tipo da rota',
  })
  @IsString({ message: '[typeRoute] O tipo da rota deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[typeRoute] O tipo da rota deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  typeRoute: string;

  @ApiProperty({
    default: 'Rota 1',
    example: 'Rota 1',
    description: 'Nome da rota',
  })
  @IsString({ message: '[nameRoute] O nome da rota deve ser do tipo texto.' })
  @IsNotEmpty({ message: '[nameRoute] O nome da rota deve ser preenchido.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  nameRoute: string;

  @ApiProperty({
    default: '2e2b8886-5d93-4304-b00f-aa08e895865d',
    type: 'UUID',
    description: 'Id do trajeto',
  })
  path: string;

  @ApiProperty({
    default: 'b8f805f2-9a96-4822-9667-2b19cc344848',
    type: 'UUID',
    description: 'Id do colaborador',
  })
  employeeIds: string;

  @ApiProperty({
    default: 10,
    type: 'UUID',
    description: 'Total de colaboradores na rota',
  })
  totalEmployees: number;

  @ApiProperty({
    default: 10,
    type: 'UUID',
    description: 'Total de colaboradores confirmados na rota',
  })
  totalConfirmed: number;

  @ApiProperty({
    default: '38e94b04-735b-41a9-a529-79023184007c',
    type: 'UUID',
    description: 'Id do motorista',
  })
  driver: string;

  @ApiProperty({
    default: '28294b80-41ce-4a89-a24e-3e3bd17701c4',
    type: 'UUID',
    description: 'Id do veículo',
  })
  vehicle: string;

  @ApiProperty()
  itinerary: string;

  @ApiProperty({
    default: '08:30',
    example: '08:30',
    description: 'Hora de início do trajeto',
  })
  @Matches(durationPathRgx, {
    message:
      '[startedAt] A hora de início do trajeto deve ser do formato: HH:MM',
  })
  startedAt: string;

  @ApiProperty({
    default: '10:00',
    example: '10:00',
    description: 'Hora de fim do trajeto',
  })
  @Matches(durationPathRgx, {
    message: '[finishedAt] A hora de fim do trajeto deve ser do formato: HH:MM',
  })
  finishedAt: string;
}
