import { HttpException, HttpStatus } from '@nestjs/common';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as moment from 'moment';
import { PeriodInDate } from '../dtos/routeHistory/dateFilter.dto';
import { ETypePeriodHistory } from './ETypes';

interface DateStartEnd {
  start: Date;
  end: Date;
}

export function getDateInLocaleTime(date: Date): Date {
  const newDate = zonedTimeToUtc(date, 'UTC');

  return newDate;
}

export function getDateStartToEndOfDay(date: string): DateStartEnd {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  if (year < 2000 || year > 2100 || Number.isNaN(year))
    throw new HttpException(
      'Selecione uma data válida',
      HttpStatus.BAD_REQUEST,
    );
  const start = getDateInLocaleTime(
    new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const end = getDateInLocaleTime(
    new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
  //  add 4 hours to get the correct date

  return { start, end };
}

export function compareDates(dateInit: Date, dateFinal: Date) {
  const atual = getDateInLocaleTime(new Date(dateInit));
  const final = getDateInLocaleTime(new Date(dateFinal));
  return atual < final;
}

export function getPeriod(period: ETypePeriodHistory): PeriodInDate {
  const newDate = getDateInLocaleTime(new Date());

  const today = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    23,
    59,
    59,
    999,
  );
  if (period === ETypePeriodHistory.DAILY) {
    const dateInitial = moment().subtract(1, 'days').toDate();
    return { dateInitial, dateFinal: today };
  }
  if (period === ETypePeriodHistory.WEEKLY) {
    const dateInitial = moment().subtract(7, 'days').toDate();
    return { dateInitial, dateFinal: today };
  }
  if (period === ETypePeriodHistory.BIWEEKLY) {
    const dateInitial = moment().subtract(15, 'days').toDate();
    return { dateInitial, dateFinal: today };
  }
  if (period === ETypePeriodHistory.MONTHLY) {
    const dateInitial = moment().subtract(30, 'days').toDate();
    return { dateInitial, dateFinal: today };
  }
}

// export function getDuration(duration: string) {
//   if (duration === '01:00') return 1.16 * 60 * 60;
//   if (duration === '01:30') return 1.66 * 60 * 60;
//   if (duration === '02:00') return 2.16 * 60 * 60;
// }

export function getDuration(duration: string): number | undefined {
  const [hours, minutes] = duration.split(':');

  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  if (
    parsedHours >= 0 &&
    parsedHours <= 2 &&
    parsedMinutes >= 0 &&
    parsedMinutes <= 59
  ) {
    const totalSeconds = parsedHours * 3600 + parsedMinutes * 60;
    return totalSeconds;
  }

  return undefined;
}

interface Options {
  maxHour: number;
  maxMinute: number;
  minMinute: number;
}

export function validateDurationIsInTheRange(
  duration: string,
  options: Options,
) {
  console.log('duration:', duration);
  
  const [hours, minutes] = duration.split(':');

  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  console.log(parsedHours, parsedMinutes);
  
  if (parsedHours === 0 && parsedMinutes === 0) {
    throw new HttpException(
      `A duração deve ser, no mínimo, ${options.minMinute} minutos!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (parsedHours > options.maxHour) {
    throw new HttpException(
      `A duração não deve ser maior do que ${options.maxHour} horas!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (parsedMinutes > options.maxMinute) {
    throw new HttpException(
      `A duração não deve ser maior do que ${options.maxMinute} minutos!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (parsedMinutes < options.minMinute) {
    throw new HttpException(
      `A duração deve ser, no mínimo, ${options.minMinute} minutos!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (parsedHours >= options.maxHour && parsedMinutes > 0) {
    throw new HttpException(
      `A duração não deve ser maior do que ${options.maxHour} horas!`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export function verifyDateFilter(date?: string) {
  if (date) {
    // verifica se a data em string é uma data válida
    const dateData = new Date(date);
    if (dateData.toString() === 'Invalid Date')
      throw new HttpException('Data inválida', HttpStatus.BAD_REQUEST);
  }
}

export function canSchedule(date: Date) {
  const atual = getDateInLocaleTime(new Date());
  const agendamento = new Date(date);
  return atual < agendamento;
}

export function convertDate(date?: Date | string) {
  let convertedDate;
  if (typeof date === 'string') convertedDate = date;
  if (date instanceof Date) convertedDate = date.toISOString().split('T')[0];
  const dateParts = convertedDate.split('-');

  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}
