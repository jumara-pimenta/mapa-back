import { EStatusPath, ETypePath } from '../../utils/ETypes';

export interface IQueryPath {
  status?: EStatusPath;
  duration?: string;
  finishedAt?: Date;
  startedAt?: string;
  startsAt?: string;
  type?: ETypePath;
}
