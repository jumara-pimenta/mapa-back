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


export function getShift(shift : string) : ETypeShiftEmployee {
  if(shift === '1')
    return ETypeShiftEmployee.FIRST
    if(shift === '2')
    return ETypeShiftEmployee.SECOND
    if(shift === '3')
    return ETypeShiftEmployee.THIRD
    if(shift === 'Sem Turno Estabelecido')
    return ETypeShiftEmployee.NOT_DEFINED
  }