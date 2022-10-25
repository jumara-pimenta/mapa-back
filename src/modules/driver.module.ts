import { Module } from "@nestjs/common";
import { DriverController } from "../controllers/driver.controller";
import { DriverRepository } from "../repositories/driver/driver.repository";
import { DriverService } from "../services/driver.service";

@Module({
  controllers: [DriverController],
  providers: [
    DriverService,
    {
      provide: "IDriverRepository",
      useClass: DriverRepository
    }
  ],
  exports: [DriverService]
})

export class DriverModule {}
