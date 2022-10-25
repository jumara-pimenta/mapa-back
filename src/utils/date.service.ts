import { HttpException, HttpStatus } from "@nestjs/common";
import { differenceInDays, differenceInSeconds, isDate } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { dateInFormatOneRgx, dateInFormatThreeRgx, dateInFormatTwoRgx } from "./Regex";

export function getDateInLocaleTime(date: Date): Date {
  const newDate = zonedTimeToUtc(date, "UTC");

  return newDate;
}

export function getDuration(previousTime: Date, currentTime: Date): number {
  const seconds = differenceInSeconds(previousTime, currentTime);

  return seconds;
}

export function getDifferenceInDays(currentDay: Date, lastDay: Date): number {
  const days = differenceInDays(currentDay, lastDay);

  return days;
}

export function resetHour(date: Date) {
  const frozenTime = "T00:00:00.000Z"

  const dayMonthAndYearExtracted = date.toJSON();

  const dateWithZeroHour = new Date(dayMonthAndYearExtracted.substring(0,10) + frozenTime);

  return dateWithZeroHour;
}

export function verifyAndFormatDate(date: string): Date {
  let regExpMatchDate: RegExpMatchArray;
  let year: string;
  let month: string;
  let day: string;
  let dateInString: string;
  let dateInFormatExpected: Date;

  if (date.match(dateInFormatOneRgx)) {
    regExpMatchDate = date.match(dateInFormatOneRgx);

    year = regExpMatchDate[3];
    month = regExpMatchDate[2];
    day = regExpMatchDate[1];

    dateInString = `${year}-${month}-${day}`;

    return dateInFormatExpected = resetHour(new Date(dateInString));
  } 

  if (date.match(dateInFormatTwoRgx)) {
    regExpMatchDate = date.match(dateInFormatTwoRgx);

    year = regExpMatchDate[1];
    month = regExpMatchDate[2];
    day = regExpMatchDate[3];

    dateInString = `${year}-${month}-${day}`;

    return dateInFormatExpected = resetHour(new Date(dateInString));
  } 

  if (date.match(dateInFormatThreeRgx)) {
    regExpMatchDate = date.match(dateInFormatThreeRgx);

    year = regExpMatchDate[3];
    month = regExpMatchDate[2];
    day = regExpMatchDate[1];

    dateInString = `${year}-${month}-${day}`;

    return dateInFormatExpected = resetHour(new Date(dateInString));
  }

  const dateInFormatValue = new Date(date)

  if (!isDate(dateInFormatValue)) {
    throw new HttpException(`Formato de data inválido. Foi enviado "${date}", mas esperava ['dd-mm-aaaa', 'aaaa-mm-dd' or 'dd/mm/aaaa']`, 
    HttpStatus.BAD_REQUEST
    );
  }
}
