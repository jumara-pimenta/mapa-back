interface IErrors {
  line: number;
  field: string;
  message: string[];
}

export class ValidationFileDTO {
  newEmployeesCreated: number;
  employeesAlreadyExistent: number;
  quantityEmployeesOnSheet: number;
  errors: IErrors[];
  // length: number;
}
