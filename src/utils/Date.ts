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

  return { start: getDateInLocaleTime(start), end: getDateInLocaleTime(end) };
}

export function compareDates(dateInit: Date, dateFinal: Date) {
  const atual = getDateInLocaleTime(new Date(dateInit));
  const final = getDateInLocaleTime(new Date(dateFinal));
  return atual < final;
}

export function getPeriod(period: ETypePeriodHistory): PeriodInDate {
  const today = getDateInLocaleTime(new Date());
  console.log(period);
  console.log(moment().subtract(7, 'days').calendar());
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
