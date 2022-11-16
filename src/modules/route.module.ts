import { forwardRef, Module } from "@nestjs/common";
import { RouteController } from "../controllers/route.controller";
import { RouteRepository } from "../repositories/route/route.repository";
import { RouteService } from "../services/route.service";
import { DriverModule } from "./driver.module";
import { PathModule } from "./path.module";
import { VehicleModule } from "./vehicle.module";

@Module({
  imports: [
    DriverModule,
    VehicleModule,
    forwardRef(() => PathModule)
  ],
  controllers: [RouteController],
  providers: [
    RouteService,
    {
      provide: "IRouteRepository",
      useClass: RouteRepository
    }
  ],
  exports: [RouteService]
})

export class RouteModule {}