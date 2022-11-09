import { Logger } from "@nestjs/common";

import * as fs from 'fs';
import * as path from 'path';
import { unlink } from "fs/promises";
import { promisify } from "util";
import { pipeline } from "stream";
const randomBytesAsync = promisify(require('crypto').randomBytes)

const uploadDirectory = path.join(process.cwd(), 'tmp', 'reports');
export const pipelineAsync = promisify(pipeline)

export const verifyReportDirectory = async (): Promise<void> => {

    if (!fs.existsSync(uploadDirectory)) {
      const _uploadDirectory = path.join(process.cwd(), 'tmp', 'reports');
  
      return fs.mkdir(_uploadDirectory, { recursive: true }, err => undefined)
    }
  
    fs.readdir(uploadDirectory, async (err, files) => {
  
      if (err) {
        return new Logger('verify directory').error('delete files', err);
      } 
  
      if(files.length) {
        files.forEach(async file => {
          await unlink(path.join(process.cwd(),'tmp','reports', file))
        });
      }
    });

}

export async function generateKeyWithFilename(filename: string): Promise<string> {
    const hash = await randomBytesAsync(16)
    const fileName = `${hash.toString("hex")}-${filename}`
    return fileName
  }