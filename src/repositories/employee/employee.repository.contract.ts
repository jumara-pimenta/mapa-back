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
  findById(id: string): Promise<Employee>;
  findByCpf(cpf: string): Promise<Employee>;
  findByRg(rg: string): Promise<Employee>;
  findByRegistration(registration: string): Promise<Employee>;
  update(data: Employee): Promise<Employee>;
  findByIds(ids: string[]): Promise<Employee[]>;
}
