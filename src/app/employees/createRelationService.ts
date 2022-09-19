import { Employee } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { EmployeeData } from "./dto/type";


export async function createEmployeeRelation(employeedata : EmployeeData, prismaService : PrismaService){
    let employ : Employee = employeedata.employee
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
      //let employ : EmployeeCreate ={employee,address}

      
      return employeedata;
}