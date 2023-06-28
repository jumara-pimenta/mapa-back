import { IsEnum } from 'class-validator';
import { ETypeRouteExport } from '../../utils/ETypes';

export class FilterRouteExport {
  @IsEnum(ETypeRouteExport, { message: 'Tipo de rota inválido' })
  type: ETypeRouteExport;
}
