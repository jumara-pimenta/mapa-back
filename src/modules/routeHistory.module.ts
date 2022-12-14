import { Module } from '@nestjs/common';
import { RouteHistoryService } from '../services/routeHistory.service';
import { RouteHistoryController } from '../controllers/routeHistory.controller';
import { RouteHistoryRepository } from '../repositories/routeHistory/routeHistory.repository';
import { RouteModule } from './route.module';

@Module({
  imports: [RouteModule],
  controllers: [RouteHistoryController],
  providers: [
    RouteHistoryService,
    {
      provide: 'IRouteHistoryRepository',
      useClass: RouteHistoryRepository,
    },
  ],
  exports: [RouteHistoryService],
})
export class RouteHistoryModule {}
