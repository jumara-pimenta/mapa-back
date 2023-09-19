import { forwardRef, Module } from '@nestjs/common';
import { GoogleApiServiceIntegration } from '../integrations/services/googleService/google.service.integration';
import { MapBoxServiceIntegration } from '../integrations/services/mapBoxService/mapbox.service.integration';
import { RouteController } from '../controllers/route.controller';
import { RouteRepository } from '../repositories/route/route.repository';
import { RouteService } from '../services/route.service';
import { DriverModule } from './driver.module';
import { EmployeeModule } from './employee.module';
import { PathModule } from './path.module';
import { RouteHistoryModule } from './routeHistory.module';
import { VehicleModule } from './vehicle.module';
import { EmployeesOnPathModule } from './employeesOnPath.module';
import { ScheduledWorkRepository } from '../repositories/scheduledWork/scheduledWork.repository';

@Module({
  imports: [
    DriverModule,
    VehicleModule,
    forwardRef(() => EmployeeModule),
    forwardRef(() => PathModule),
    forwardRef(() => RouteHistoryModule),
    forwardRef(() => EmployeesOnPathModule),
  ],
  controllers: [RouteController],
  providers: [
    RouteService,
    {
      provide: 'IRouteRepository',
      useClass: RouteRepository,
    },
    {
      provide: 'IMapBoxServiceIntegration',
      useClass: MapBoxServiceIntegration,
    },
    {
      provide: 'IGoogleApiServiceIntegration',
      useClass: GoogleApiServiceIntegration,
    },
    {
      provide: 'IScheduledWorkRepository',
      useClass: ScheduledWorkRepository,
    },
  ],
  exports: [RouteService],
})
export class RouteModule {}
