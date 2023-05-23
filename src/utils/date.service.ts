import { HttpException, HttpStatus } from '@nestjs/common';
import { differenceInDays, differenceInSeconds, isDate } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import {
  ETypeShiftEmployee,
  ETypeShiftEmployeeExports,
  ETypeShiftRotue,
} from './ETypes';
import {
  dateInFormatOneRgx,
  dateInFormatThreeRgx,
  dateInFormatTwoRgx,
} from './Regex';

class startAndFinishAt {
  startAt: string;
  finishAt: string;
}

export function getDateInLocaleTime(date: Date): Date {
  const newDate = zonedTimeToUtc(date, 'UTC');

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
  const frozenTime = 'T00:00:00.000Z';

  const dayMonthAndYearExtracted = date.toJSON();

  const dateWithZeroHour = new Date(
    dayMonthAndYearExtracted.substring(0, 10) + frozenTime,
  );

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

    return (dateInFormatExpected = resetHour(new Date(dateInString)));
  }

  if (date.match(dateInFormatTwoRgx)) {
    regExpMatchDate = date.match(dateInFormatTwoRgx);

    year = regExpMatchDate[1];
    month = regExpMatchDate[2];
    day = regExpMatchDate[3];

    dateInString = `${year}-${month}-${day}`;

    return (dateInFormatExpected = resetHour(new Date(dateInString)));
  }

  if (date.match(dateInFormatThreeRgx)) {
    regExpMatchDate = date.match(dateInFormatThreeRgx);

    year = regExpMatchDate[3];
    month = regExpMatchDate[2];
    day = regExpMatchDate[1];

    dateInString = `${year}-${month}-${day}`;

    dateInFormatExpected = resetHour(new Date(dateInString))

    return (dateInFormatExpected);
  }

  const dateInFormatValue = new Date(date);

  if (!isDate(dateInFormatValue)) {
    throw new HttpException(
      `Formato de data inválido. Foi enviado "${date}", mas esperava ['dd-mm-aaaa', 'aaaa-mm-dd' or 'dd/mm/aaaa']`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export function convertTimeToDate(hour: string): Date {
  const timeSplited = hour.split(':');
  return new Date(
    2000,
    1,
    1,
    Number(timeSplited[0]),
    Number(timeSplited[1]),
    0,
  );
}

export function convertToDate(date: string): Date | null {
  const data = new Date('12/30/1899');
  //how to add days to date

  data.setDate(data.getDate() + Number(date));
  return data;
}

export function getStartAtAndFinishAt(type: ETypeShiftRotue): startAndFinishAt {
  if (type === ETypeShiftRotue.FIRST)
    return { startAt: '07:30', finishAt: '17:30' };
  if (type === ETypeShiftRotue.SECOND)
    return { startAt: '17:30', finishAt: '02:30' };
  if (type === ETypeShiftRotue.THIRD)
    return { startAt: '03:30', finishAt: '12:00' };
}

export function getSpecialHour(
  depatureTime: string,
  backTime: string,
): startAndFinishAt {
  if (!(depatureTime && backTime))
    throw new HttpException(
      'Hora de partida e hora de retorno são obrigatórias."',
      HttpStatus.BAD_REQUEST,
    );
  if (
    depatureTime.match(/^[0-9]{2}:[0-9]{2}$/) &&
    backTime.match(/^[0-9]{2}:[0-9]{2}$/)
  ) {
    return { startAt: depatureTime, finishAt: backTime };
  }
  throw new HttpException(
    `Formato de hora inválido. Foi enviado "${depatureTime}" e "${backTime}", mas esperava ['hh:mm']`,
    HttpStatus.BAD_REQUEST,
  );
}
export function getShiftToGraphic(starstAt: string, type: string): string {
  if (starstAt === '07:30') return 'Turno 1';
  if (starstAt === '17:30') return type === 'IDA' ? 'Turno 2' : 'Turno 1';
  if (starstAt === '02:30') return 'Turno 2';
  if (starstAt === '03:30' || starstAt === '12:00') return 'Turno 3';
  return 'Extra';
}

export function getStartAtAndFinishEmployee(
  type: ETypeShiftEmployee,
): startAndFinishAt | null {
  if (type === ETypeShiftEmployee.FIRST)
    return { startAt: '07:30', finishAt: '17:30' };
  if (type === ETypeShiftEmployee.SECOND)
    return { startAt: '17:30', finishAt: '02:30' };
  if (type === ETypeShiftEmployee.THIRD)
    return { startAt: '03:30', finishAt: '12:00' };
  if (type === ETypeShiftEmployee.NOT_DEFINED) return null;
}

export function getShiftStartAtAndExports(type: ETypeShiftEmployeeExports) {
  if (type === ETypeShiftEmployeeExports.FIRST) return '1';
  if (type === ETypeShiftEmployeeExports.SECOND) return '2';
  if (type === ETypeShiftEmployeeExports.THIRD) return '3';
  if (type === ETypeShiftEmployeeExports.NOT_DEFINED)
    return 'Sem Turno Estabelecido';
}
