import { faker } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDTO } from 'src/dtos/employee/createEmployee.dto';
import { Employee } from 'src/entities/employee.entity';
import { ETypePath, ETypePin, ETypeRoute } from 'src/utils/ETypes';
import { v4 as uuid } from 'uuid';

faker.locale = 'pt_BR';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    let paths = await this.path.findMany();

    if (paths.length === 0) {
      const employees: any[] = [];

      const pin = await this.pin.create({
        data: {
          id: uuid(),
          title: 'Em Frente ao principe do açai',
          local: 'Príncipe do Açaí Frozen ',
          details: 'R. Paço Real, 144 - Raiz, Manaus - AM, 69068-650',
          lat: '-3.127925',
          lng: '-59.992930',
          createdAt: new Date(),
        },
      });

      const pinDenso = await this.pin.create({
        data: {
          id: uuid(),
          title: 'Denso',
          local: 'Denso LTDA ',
          details:
            'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69075-000',
          lat: '-3.110916954937',
          lng: '-59.9626690972',
          createdAt: new Date(),
        },
      });

      for (let i = 0; i < 12; i++) {
        employees.push({
          name: faker.name.fullName(),
          address: JSON.stringify({
            cep: faker.address.zipCodeByState('AM'),
            city: faker.address.city(),
            complement: '',
            neighborhood: faker.address.secondaryAddress(),
            number: faker.random.numeric(8).toString(),
            state: 'AM',
            street: faker.address.streetAddress(true),
          }),
          registration: faker.random.numeric(6).toString(),
          costCenter: faker.random.numeric(6).toString(),
          password: await bcrypt.hash('Denso', 10),
          admission: faker.date.past(),
          role: faker.company.name(),
          shift: faker.random.numeric(1).toString(),
          id: uuid(),
          createdAt: new Date(),
        });
      }

      await this.employee.createMany({
        data: employees,
      });

      const employeesId = await this.employee.findMany({
        select: {
          id: true,
        },
      });

      employeesId.forEach(async (employee) => {
        await this.employeesOnPin.create({
          data: {
            pinId: pin.id,
            employeeId: employee.id,
            type: ETypePin.CONVENTIONAL,
          },
        });
      });

      const driverId = [];

      for (let i = 0; i < 4; i++) {
        driverId.push({
          id: uuid(),
          name: faker.name.fullName(),
          category: 'D',
          cnh: faker.random.numeric(11).toString(),
          createdAt: new Date(),
          cpf: faker.random.numeric(11).toString(),
          password: await bcrypt.hash('Denso', 10),
          validation: faker.date.future(),
        });
      }

      await this.driver.createMany({
        data: driverId,
      });

      const vehicleId = [];

      for (let i = 0; i < 4; i++) {
        vehicleId.push({
          id: uuid(),
          capacity: +faker.random.numeric(2),
          expiration: faker.date.future(),
          lastMaintenance: faker.date.past(),
          note: faker.lorem.paragraph(),
          lastSurvey: faker.date.past(),
          plate: faker.vehicle.vrm(),
          renavam: faker.random.numeric(11).toString(),
          type: faker.vehicle.type(),
          isAccessibility: true,
          company: faker.company.name(),
          createdAt: new Date(),
        });
      }

      await this.vehicle.createMany({
        data: vehicleId,
      });

      const routeId = [];

      for (let i = 0; i < 1; i++) {
        routeId.push({
          id: uuid(),
          description: 'Rota ' + i + 1,
          createdAt: new Date(),
          driverId: driverId[i].id,
          vehicleId: vehicleId[i].id,
          distance: 'PENDENTE',
          status: 'ACTIVE',
          type: ETypeRoute.CONVENTIONAL,
          path: {
            createMany: {
              data: [
                {
                  id: uuid(),
                  duration: '00:10',
                  startsAt: '08:00',
                  type: ETypePath.ONE_WAY,
                  status: 'ACTIVE',
                  createdAt: new Date(),
                },
                {
                  id: uuid(),
                  duration: '00:10',
                  startsAt: '19:00',
                  type: ETypePath.RETURN,
                  status: 'ACTIVE',
                  createdAt: new Date(),
                },
              ],
            },
          },
        });

        for await (const route of routeId) {
          await this.route.create({
            data: route,
          });
        }

        paths = await this.path.findMany();

        for await (const path of paths) {
          let incremetable = 0;
          for await (const employee of employees) {
            await this.employeesOnPath.create({
              data: {
                pathId: path.id,
                employeeId: employee.id,
                confirmation: true,
                createdAt: new Date(),
                description: 'test',
                position: incremetable++,
                id: uuid(),
              },
            });
          }
        }
      }
      const backOfficeUser = await this.backOfficeUser.findFirst({
        where: {
          email: 'admin@rotas.com.br',
        },
      });

      if (!backOfficeUser) {
        await this.backOfficeUser.upsert({
          where: {
            email: 'admin@rotas.com.br',
          },
          create: {
            id: uuid(),
            email: 'admin@rotas.com.br',
            password: await bcrypt.hash('Denso', 10),
            name: 'Admin',
            role: 'ADMIN',
            createdAt: new Date(),
          },
          update: {
            email: 'admin@rotas.com.br',
            password: await bcrypt.hash('Denso', 10),
            name: 'Admin',
            role: 'ADMIN',
          },
        });
      }
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
