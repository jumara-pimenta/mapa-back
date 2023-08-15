import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateStatusRouteJob } from '../jobs/route/updateStatusRoute.job';
import { RouteModule } from './route.module';
import { ScheduledWorkRepository } from '../repositories/scheduledWork/scheduledWork.repository';
import { FinishRouteJob } from '../jobs/route/finishRoute.job';
import { PathModule } from './path.module';

@Module({
  imports: [ScheduleModule.forRoot(), RouteModule, PathModule],
  providers: [
    UpdateStatusRouteJob,
    {
      provide: 'IScheduledWorkRepository',
      useClass: ScheduledWorkRepository,
    },
    FinishRouteJob,
  ],
})
export class JobsModule {}
