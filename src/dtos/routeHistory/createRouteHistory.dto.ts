import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateRouteHistoryDTO {
  employeesId: string;
  routeId: string;
}
