import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateStatusRouteJob } from '../jobs/route/updateStatusRoute.job';
import { RouteModule } from './route.module';
import { ScheduledWorkRepository } from '../repositories/scheduledWork/scheduledWork.repository';

@Module({
  imports: [ScheduleModule.forRoot(), RouteModule],
  providers: [UpdateStatusRouteJob, {
    provide: 'IScheduledWorkRepository',
    useClass: ScheduledWorkRepository,
  },],
})
export class JobsModule {}
