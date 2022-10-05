import { PrismaService } from "src/database/prisma.service";
import { Employee } from "../dtos/employee/employee.dto";
import { EmployeeData } from "../dtos/employee/createEmployeeRelation.dto";
import { EmployeeCreate } from "../dtos/employee/createEmployee.dto";


export async function createEmployeeRelation(employeedata : EmployeeData, prismaService : PrismaService){
    
      const employee = await prismaService.employee.create({
        data:{
         registration : employeedata.employee.registration,
         name : employeedata.employee.name,
         cpf: employeedata.employee.cpf,
         rg: employeedata.employee.rg,
         admission: employeedata.employee.admission,
         role: employeedata.employee.role,
         shift: employeedata.employee.shift,
         costCenter: employeedata.employee.costCenter,
         address: {
          create:[
            {
              street: employeedata.address[0].street,
              cep: employeedata.address[0].cep,
              number:employeedata.address[0].number,
              complement: employeedata.address[0].complement,
              neighborhood: employeedata.address[0].neighborhood,
              city: employeedata.address[0].city,
              state: employeedata.address[0].state,
              latitude: employeedata.address[0].latitude,
              longitude: employeedata.address[0].longitude,
              type: employeedata.address[0].type
              },
              {
                street: employeedata.address[1].street,
                cep: employeedata.address[1].cep,
                number:employeedata.address[1].number,
                complement: employeedata.address[1].complement,
                neighborhood: employeedata.address[1].neighborhood,
                city: employeedata.address[1].city,
                state: employeedata.address[1].state,
                latitude: employeedata.address[1].latitude,
                longitude: employeedata.address[1].longitude,
                type: employeedata.address[1].type
                }
          ]
         }
        }
      })

      
      return employee;  
}