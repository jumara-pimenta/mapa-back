import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { ETypeShiftEmployee } from './ETypes';

export const pipelineAsync = promisify(pipeline);
const uploadDirectory = path.join(process.cwd(), 'tmp', 'reports');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomBytesAsync = promisify(require('crypto').randomBytes);

export function convertAndVerifyNumber(value: number): number {
  const valueConverted = Number(value);

  if (isNaN(valueConverted)) {
    throw new HttpException(
      `O valor informado deve ser do tipo numérico: ${value}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return valueConverted;
}

export async function generateKeyWithFilename(
  filename: string,
): Promise<string> {
  const hash = await randomBytesAsync(16);
  const fileName = `${hash.toString('hex')}-${filename}`;
  return fileName;
}

export const verifyReportDirectory = async (): Promise<void> => {
  if (!fs.existsSync(uploadDirectory)) {
    const _uploadDirectory = path.join(process.cwd(), 'tmp', 'reports');

    return fs.mkdir(_uploadDirectory, { recursive: true }, (err) => undefined);
  }

  fs.readdir(uploadDirectory, async (err, files) => {
    if (err) {
      return new Logger('verify directory').error('delete files', err);
    }

    if (files.length) {
      files.forEach(async (file) => {
        await unlink(path.join(process.cwd(), 'tmp', 'reports', file));
      });
    }
  });
};

export function getShift(shift: string): ETypeShiftEmployee {
  if (shift === '1') return ETypeShiftEmployee.FIRST;
  if (shift === '2') return ETypeShiftEmployee.SECOND;
  if (shift === '3') return ETypeShiftEmployee.THIRD;
  if (shift === 'Sem Turno Estabelecido') return ETypeShiftEmployee.NOT_DEFINED;
}
export type RouteMobile = {
  id: string;
  description: string;
  distance: string;
  driver: string;
  vehicle: string;
  status: string;
  pathType: string;
  type: string;
  time: string;
  duration: string;
};

export function distanceBetweenPoints(p1: any, p2: any) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(p2.lat - p1.lat);
  const dLon = deg2rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(p1.lat)) *
      Math.cos(deg2rad(p2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
