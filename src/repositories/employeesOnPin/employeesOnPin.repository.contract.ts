import { EmployeesOnPin } from "../../entities/employeesOnPin.entity";

export default interface IEmployeesOnPinRepository {
  create(data: EmployeesOnPin): Promise<EmployeesOnPin>
  update(pinId: string, data: EmployeesOnPin): Promise<EmployeesOnPin>
}
