import { EmployeesOnPin } from '../../entities/employeesOnPin.entity';

export default interface IEmployeesOnPinRepository {
  create(data: EmployeesOnPin): Promise<EmployeesOnPin>;
  find(employeeId: string, pinId: string): Promise<EmployeesOnPin>;
  update(pinId: string, data: EmployeesOnPin): Promise<EmployeesOnPin>;
  delete(employeeId: string, pinId: string): Promise<void>;
}
