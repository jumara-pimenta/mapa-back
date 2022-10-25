import { EmployeesOnPin } from "../../entities/employeesOnPin.entity";

export default interface IEmployeesOnPinRepository {
  create(data: EmployeesOnPin): Promise<EmployeesOnPin>
}
