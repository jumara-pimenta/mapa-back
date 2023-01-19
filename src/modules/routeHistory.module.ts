import { Module } from '@nestjs/common';
import { RouteHistoryService } from '../services/routeHistory.service';
import { RouteHistoryController } from '../controllers/routeHistory.controller';
import { RouteHistoryRepository } from '../repositories/routeHistory/routeHistory.repository';
import { PathModule } from './path.module';
import { DriverModule } from './driver.module';
import { VehicleModule } from './vehicle.module';

@Module({
  imports: [PathModule, DriverModule, VehicleModule],
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
