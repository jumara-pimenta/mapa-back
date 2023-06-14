import { Page, PageResponse } from '../../configs/database/page.model';
import { EmployeesOnPath } from '../../entities/employeesOnPath.entity';

export default interface IEmployeesOnPathRepository {
  create(data: EmployeesOnPath): Promise<EmployeesOnPath>;
  delete(id: string): Promise<EmployeesOnPath>;
  findAll(page: Page, filters?: any): Promise<PageResponse<EmployeesOnPath>>;
  findById(id: string): Promise<EmployeesOnPath>;
  findByIds(id: string): Promise<EmployeesOnPath[]>;
  findByPath(pathId: string): Promise<EmployeesOnPath[]>;
  findByRoute(routeId: string): Promise<EmployeesOnPath>;
  findManyByRoute(routeId: string): Promise<EmployeesOnPath[]>;
  update(data: EmployeesOnPath): Promise<EmployeesOnPath>;
  findByPathAndPin(pathId: string, pinId: string): Promise<EmployeesOnPath[]>;
  updateMany(
    data: EmployeesOnPath[],
    confirmation: boolean,
  ): Promise<EmployeesOnPath[]>;
  findByEmployeeAndPath(employeeId: string, pathId: string): Promise<EmployeesOnPath>;
}
