import { FiltersVehicleDTO } from "../../dtos/vehicle/filtersVehicle.dto";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Vehicle } from "../../entities/vehicle.entity";

export default interface IVehicleRepository {
  create(data: Vehicle): Promise<Vehicle>
  delete(id: string): Promise<Vehicle>
  findAll(page: Page, filters?: FiltersVehicleDTO): Promise<PageResponse<Vehicle>>
  findById(id: string): Promise<Vehicle>
  update(data: Vehicle): Promise<Vehicle>
}
