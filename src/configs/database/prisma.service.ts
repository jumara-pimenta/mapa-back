import { faker } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDTO } from 'src/dtos/employee/createEmployee.dto';
import { Employee } from 'src/entities/employee.entity';
import {
  EStatusPath,
  EStatusRoute,
  ETypePath,
  ETypePin,
  ETypeRoute,
} from 'src/utils/ETypes';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    let paths = await this.path.findMany();

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

    if (paths.length === 0) {
      faker.locale = 'pt_BR';
      const employees: any[] = [];

      const pins = [];

      for (let i = 0; i < 12; i++) {
        pins.push({
          id: uuid(),
          title: faker.address.direction(),
          local: faker.address.streetAddress(true),
          details:
            faker.address.streetAddress(true) +
            ', ' +
            faker.address.buildingNumber() +
            ', ' +
            'Manaus - AM ,' +
            faker.address.zipCodeByState('AM'),
          lat: faker.address.latitude(-2.9469, -3.1589, 6),
          lng: faker.address.longitude(-59.8246, -60.1083, 6),
          createdAt: new Date(),
        });

        employees.push({
          name: faker.name.fullName(),
          address: JSON.stringify({
            cep: faker.address.zipCodeByState('AM').replace('-', ''),
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

      await this.pin.createMany({
        data: pins,
      });

      await this.employee.createMany({
        data: employees,
      });

      const employeesId = await this.employee.findMany({
        select: {
          id: true,
        },
      });

      for (let i = 0; i < 12; i++) {
        await this.employeesOnPin.create({
          data: {
            pinId: pins[i].id,
            employeeId: employeesId[i].id,
            type: ETypePin.CONVENTIONAL,
          },
        });
      }
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

      for (let i = 0; i < 2; i++) {
        routeId.push({
          id: uuid() + i,
          description: 'Rota ' + `${i + 1}`,
          createdAt: new Date(),
          driverId: driverId[i].id,
          vehicleId: vehicleId[i].id,
          distance: 'PENDENTE',
          status: EStatusRoute.PENDING,
          type: i === 0 ? ETypeRoute.CONVENTIONAL : ETypeRoute.EXTRA,
          path: {
            createMany: {
              data: [
                {
                  id: uuid(),
                  duration: '00:01',
                  startsAt: `0${6 + i}:00`,
                  type: ETypePath.ONE_WAY,
                  status: EStatusPath.PENDING,
                  createdAt: new Date(),
                },
                {
                  id: uuid(),
                  duration: '00:01',
                  startsAt: `${19 + i}:00`,
                  type: ETypePath.RETURN,
                  status: EStatusPath.PENDING,
                  createdAt: new Date(),
                },
              ],
            },
          },
        });

        for await (const route of routeId) {
          if (routeId.length === 2) {
            await this.route.create({
              data: route,
            });
          }
        }

        paths = await this.path.findMany();

        for await (const path of paths) {
          let incremetable = 0;
          for await (const employee of employeesId) {
            await this.employeesOnPath.create({
              data: {
                pathId: path.id,
                employeeId: employee.id,
                confirmation: true,
                createdAt: new Date(),
                description: 'test',
                position: incremetable++,
                boardingAt: null,
                id: uuid(),
              },
            });
          }
        }
      }
    }

    await this.pin.upsert({
      where: {
        id: process.env.DENSO_ID,
      },
      create: {
        id: process.env.DENSO_ID,
        title: 'Denso',
        local: 'Denso LTDA ',
        details:
          'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
        lat: '-3.1112953',
        lng: '-59.9643917',
        createdAt: new Date(),
      },
      update: {
        id: process.env.DENSO_ID,
        title: 'Denso',
        local: 'Denso LTDA ',
        details:
          'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
        lat: '-3.1112953',
        lng: '-59.9643917',
        createdAt: new Date(),
      },
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
