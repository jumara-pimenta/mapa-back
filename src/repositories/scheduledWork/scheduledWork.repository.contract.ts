import { EEntity, EStatusWork } from '../../utils/ETypes';
import { ScheduledWork } from '../../entities/scheduledWork.entity';

export default interface IScheduledWorkRepository {
  create(data: ScheduledWork): Promise<ScheduledWork>;
  update(data: ScheduledWork): Promise<ScheduledWork>;
  findManyByEntityAndStatusToday(entity: EEntity, status: EStatusWork): Promise<Array<ScheduledWork>>;
}
