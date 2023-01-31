import { RouteHistoryModule } from './routeHistory.module';
import { VehicleModule } from './vehicle.module';
import { DriverModule } from './driver.module';
import { forwardRef, Module } from '@nestjs/common';
import { PathController } from '../controllers/path.controller';
import { PathRepository } from '../repositories/path/path.repository';
import { PathService } from '../services/path.service';
import { EmployeesOnPathModule } from './employeesOnPath.module';
import { RouteModule } from './route.module';
import { SinisterModule } from './sinister.module';

@Module({
  imports: [
    forwardRef(() => RouteModule),
    forwardRef(() => EmployeesOnPathModule),
    DriverModule,
    VehicleModule,
    RouteHistoryModule,
    forwardRef(() => SinisterModule),
  ],
  controllers: [PathController],
  providers: [
    PathService,
    {
      provide: 'IPathRepository',
      useClass: PathRepository,
    },
  ],
  exports: [PathService],
})
export class PathModule {}
