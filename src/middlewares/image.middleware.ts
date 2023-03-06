import { HttpException, HttpStatus } from '@nestjs/common';

export const xlsxFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(xlsx)$/)) {
    return callback(
      new HttpException(
        'Apenas arquivos de tipo xlsx são permitidos!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
