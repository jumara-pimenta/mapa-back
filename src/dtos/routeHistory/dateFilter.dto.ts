import { IsDateString } from 'class-validator';

export class DateFilterDTO {
  @IsDateString()
  dateInit: Date;
  @IsDateString()
  dateFinal: Date;
}
