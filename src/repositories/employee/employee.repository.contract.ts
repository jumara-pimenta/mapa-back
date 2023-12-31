import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Employee } from '../../entities/employee.entity';

export default interface IEmployeeRepository {
  create(data: Employee): Promise<Employee>;
  delete(id: string): Promise<Employee>;
  findAll(
    page: Page,
    filters?: FiltersEmployeeDTO,
  ): Promise<PageResponse<Employee>>;
  findAllExport(): Promise<Employee[]>;
  findById(id: string): Promise<Employee>;
  findByRegistration(registration: string): Promise<Employee>;
  findByRegistrationDeleted(registration: string): Promise<Employee>;
  findByRegistrationByImport(registration: string): Promise<Employee>;
  update(data: Employee): Promise<Employee>;
  findByIds(ids: string[]): Promise<Employee[]>;
  listAllEmployeesDeleted(ids: string[]): Promise<Employee[]>;
  checkExtraEmployee(ids: string[], date: string): Promise<Employee[]>;
  findEmployeeAtDenso(ids: string[]): Promise<Partial<Employee>[]>;
  updateEmployeePassword(registration: string, password: string): Promise<Employee>;
  resetEmployeePassword(registration: string): Promise<Employee>;
  findManyByPath(pathId: string): Promise<Employee[]>;
}
