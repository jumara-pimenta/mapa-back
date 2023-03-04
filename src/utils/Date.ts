import { HttpException, HttpStatus } from '@nestjs/common';
import { getDate } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as moment from 'moment';
import { PeriodInDate } from 'src/dtos/routeHistory/dateFilter.dto';
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
  if(year < 2000 || year > 2100) throw new HttpException('Selecione uma data válida', HttpStatus.BAD_REQUEST);
  const start = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    0,
    0,
    0,
    0,
  );
  const end = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    23,
    59,
    59,
    999,
  );
  //  add 4 hours to get the correct date
  start.setHours(start.getHours() + 20);
  end.setHours(end.getHours() + 20);
  
  console.log(start,end);
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

export function getDuration(duration: string) {
  if (duration === '01:00') return 1.16 * 60 * 60;
  if (duration === '01:30') return 1.66 * 60 * 60;
  if (duration === '02:00') return 2.16 * 60 * 60;
}

export function verifyDateFilter(date?: string) {
  if (date) {
    // verifica se a data em string é uma data válida
    const dateData = new Date(date);
    if (dateData.toString() === 'Invalid Date')
      throw new HttpException('Data inválida', HttpStatus.BAD_REQUEST);
  }
}
