import { EStatusPath } from '../../utils/ETypes';
import { Path } from '../../entities/path.entity';

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
  findByEmployeeOnPath(employeeId: string): Promise<Partial<Path>>;
  findAll(filter?: any): Promise<Path[]>;
  softDelete(id: string): Promise<Path>;
}
