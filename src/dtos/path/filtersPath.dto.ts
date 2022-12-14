import { EStatusPath, ETypePath } from '../../utils/ETypes';

export class FiltersPathDTO {
  status?: EStatusPath;
  duration?: string;
  finishedAt?: Date;
  startedAt?: string;
  startsAt?: string;
  type?: ETypePath;
}
