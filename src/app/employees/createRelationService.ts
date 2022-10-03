import { PrismaService } from "src/database/prisma.service";
import { Employee } from "../dtos/employee/employee.dto";
import { EmployeeData } from "../dtos/employee/createEmployeeRelation.dto";
import { EmployeeCreate } from "../dtos/employee/createEmployee.dto";


export async function createEmployeeRelation(employeedata : EmployeeData, prismaService : PrismaService){
    let employ : EmployeeCreate= employeedata.employee
      const employee = await prismaService.employee.create({
        data: employ
      });
      let endereco = employeedata.address[0]
      endereco.employeeId = employee.id
      await prismaService.address.create({
       data: endereco,
       
     });

     endereco = employeedata.address[1]
      endereco.employeeId = employee.id
      await prismaService.address.create({
       data: endereco,
       
     });

      
      return employee;  
}