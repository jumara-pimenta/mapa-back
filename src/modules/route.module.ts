import { forwardRef, Module } from '@nestjs/common';
import { GoogleApiServiceIntegration } from 'src/integrations/services/googleService/google.service.integration';
import { MapBoxServiceIntegration } from 'src/integrations/services/mapBoxService/mapbox.service.integration';
import { RouteController } from '../controllers/route.controller';
import { RouteRepository } from '../repositories/route/route.repository';
import { RouteService } from '../services/route.service';
import { DriverModule } from './driver.module';
import { EmployeeModule } from './employee.module';
import { PathModule } from './path.module';
import { RouteHistoryModule } from './routeHistory.module';
import { VehicleModule } from './vehicle.module';

@Module({
  imports: [
    DriverModule,
    VehicleModule,
    forwardRef(() => EmployeeModule),
    forwardRef(() => PathModule),
    forwardRef(() => RouteHistoryModule),
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
  ],
  exports: [RouteService],
})
export class RouteModule {}
