import { Module } from "@nestjs/common";
import { VehicleController } from "../controllers/vehicle.controller";
import { VehicleRepository } from "../repositories/vehicle/vehicle.repository";
import { VehicleService } from "../services/vehicle.service";

@Module({
  controllers: [VehicleController],
  providers: [
    VehicleService,
    {
      provide: "IVehicleRepository",
      useClass: VehicleRepository
    }
  ],
  exports: [VehicleService]
})

export class VehicleModule {}
