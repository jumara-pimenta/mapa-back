import { ERoutePathStatus, EStatusPath } from '../../utils/ETypes';
import { Path } from '../../entities/path.entity';
import { FiltersPathDTO } from '../../dtos/path/filtersPath.dto';

export default interface IPathRepository {
  create(data: Path): Promise<Path>;
  delete(id: string): Promise<Path>;
  findById(id: string): Promise<Path>;
  findByDriver(driverId: string): Promise<Path[]>;
  findByEmployee(employeeId: string): Promise<Path[]>;
  findByRoute(routeId: string): Promise<Path[]>;
  findByDriverIdAndStatus(driverId: string, status: EStatusPath): Promise<Path>;
  update(data: Path): Promise<Path>;
  findByEmployeeAndStatus(
    employeeId: string,
    status: EStatusPath,
  ): Promise<Path>;
  findManyPathsNotStartedByEmployee(
    employeeId: string,
  ): Promise<Path[]>;
  findByEmployeeOnPath(employeeId: string): Promise<Partial<Path>>;
  findByEmployeeOnPathMobile(id: string): Promise<Path>;
  findAll(filter?: FiltersPathDTO): Promise<Path[]>;
  findAllToday(filter?: FiltersPathDTO): Promise<Path[]>;
  softDelete(id: string): Promise<Path>;
  findByStatusAndDriver(status: EStatusPath, driverId: string): Promise<Path[]>
  findByIdToDelete(id: string): Promise<Path | null>
  findManyByStatus(status: ERoutePathStatus): Promise<Path[]>
}
