import { zonedTimeToUtc } from 'date-fns-tz';

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
