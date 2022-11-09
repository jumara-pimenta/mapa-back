import { forwardRef, Module } from "@nestjs/common";
import { PathController } from "src/controllers/path.controller";
import { PathRepository } from "../repositories/path/path.repository";
import { PathService } from "../services/path.service";
import { EmployeesOnPathModule } from "./employeesOnPath.module";
import { RouteModule } from "./route.module";

@Module({
  imports: [
    forwardRef(() => RouteModule),
    forwardRef(() => EmployeesOnPathModule)
  ],
  controllers: [PathController],
  providers: [
    PathService,
    {
      provide: "IPathRepository",
      useClass: PathRepository
    }
  ],
  exports: [PathService]
})

export class PathModule {}
