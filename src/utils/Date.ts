import { zonedTimeToUtc } from 'date-fns-tz';

export function getDateInLocaleTime(date: Date): Date {
  const newDate = zonedTimeToUtc(date, 'UTC');

  return newDate;
}
