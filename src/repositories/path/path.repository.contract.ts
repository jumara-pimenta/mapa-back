import { EStatusPath } from 'src/utils/ETypes';
import { Path } from '../../entities/path.entity';

export default interface IPathRepository {
  create(data: Path): Promise<Path>;
  delete(id: string): Promise<Path>;
  findById(id: string): Promise<Path>;
  findByRoute(routeId: string): Promise<Path[]>;
  update(data: Path): Promise<Path>;
  findByEmployeeAndStatus(employeeId: string, status: EStatusPath): Promise<Path>;
}
