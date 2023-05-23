import { faker } from '@faker-js/faker/locale/pt_BR';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { getDateInLocaleTime } from '../../utils/Date';
import { ETypePin } from '../../utils/ETypes';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    const paths = await this.path.findMany();

    await this.backOfficeUser.upsert({
      where: {
        email: 'adm@rotas.com.br',
      },
      create: {
        id: process.env.DENSO_ID,
        email: 'adm@rotas.com.br',
        password: await bcrypt.hash('Denso', 10),
        name: 'Adm',
        role: 'ADMIN',
        roleType: 'ADMIN',
        createdAt: getDateInLocaleTime(new Date()),
      },
      update: {
        email: 'adm@rotas.com.br',
        password: await bcrypt.hash('Denso', 10),
        name: 'adm',
        role: 'ADMIN',
        roleType: 'ADMIN',
        id: process.env.DENSO_ID,
      },
    });

    await this.pin.upsert({
      where: {
        id: process.env.DENSO_ID,
      },
      create: {
        id: process.env.DENSO_ID,
        title: 'Denso',
        details: 'Denso LTDA ',
        local:
          'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
        district: 'Distrito Industrial I',
        lat: '-3.111024790307586',
        lng: '-59.96232450142952',
        createdAt: getDateInLocaleTime(new Date()),
      },
      update: {
        id: process.env.DENSO_ID,
        title: 'Denso',
        details: 'Denso LTDA ',
        local:
          'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69057-000',
        district: 'Distrito Industrial I',

        lat: '-3.111024790307586',
        lng: '-59.96232450142952',
        createdAt: getDateInLocaleTime(new Date()),
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      if (paths.length === 0) {
        const employees: any[] = [];

        const pins = [
          {
            id: uuid(),
            title: 'Iteam',
            local:
              'Av Gov. Danilo Matos Aerosa, 381 Bloco F - Fucapi - Distrito Industrial I, Manaus - AM, 69075-351 ',
            details: 'Em frente a ITEAM',
            district: 'Distrito Industrial I',
            lat: '-3.1368534098377596',
            lng: '-59.98132250432473',
            createdAt: getDateInLocaleTime(new Date()),
          },
          {
            id: uuid(),
            title: 'UBS Almir Pedreira',
            local:
              'UBS Almir Pedreira	 - R. Claudiano Moreira, s/n - Crespo, Manaus - AM, 69075-005',
            details: 'Em frente a UBS Almir Pedreira',
            district: 'Crespo',
            lat: '-3.1379972441350534',
            lng: '-59.984713639689815',
            createdAt: getDateInLocaleTime(new Date()),
          },
          {
            id: uuid(),
            title: 'Distrito da Bola',
            local:
              'Av. Gov. Danilo de Matos Areosa, 200 - Distrito Industrial I, Manaus - AM, 69075-351',
            details: 'Em frente a Distrito da Bola',
            district: 'Distrito Industrial I',
            lat: '-3.1356565487524675',
            lng: '-59.98612092294195',
            createdAt: getDateInLocaleTime(new Date()),
          },
          {
            id: uuid(),
            title: 'Top Pousada',
            local:
              'Av. Buriti, 556 - Distrito Industrial I, Manaus - AM, 69075-510',
            details: 'Em frente a Top Pousada',
            district: 'Distrito Industrial I',
            lat: '-3.119582454197964',
            lng: '-59.97671361130084',
            createdAt: getDateInLocaleTime(new Date()),
          },
          {
            id: uuid(),
            title: 'Patricia Bradock Fardas',
            local: 'R. das Águias, 40 - São Lázaro, Manaus - AM, 69073-140',
            details: 'Em frente a Patricia Bradock Fardas',
            district: 'São Lázaro',
            lat: '-3.138758531627776',
            lng: '-59.98713727671988',
            createdAt: getDateInLocaleTime(new Date()),
          },
          {
            id: uuid(),
            title: 'Lagoa Verde',
            local: 'Av. Rodrigo Otávio, 2 - São Lázaro, Manaus - AM, 69073-177',
            details: 'Em frente a Lagoa Verde',
            district: 'São Lázaro',
            lat: '-3.1376438100682718',
            lng: '-59.988923509861465',
            createdAt: getDateInLocaleTime(new Date()),
          },
        ];

        for (let i = 0; i < 6; i++) {
          employees.push({
            name: faker.person.fullName(),
            address: JSON.stringify({
              cep: faker.location.zipCodeByState('AM').replace('-', ''),
              city: faker.location.city(),
              complement: '',
              neighborhood: faker.location.secondaryAddress(),
              number: faker.string.numeric(8).toString(),
              state: 'AM',
              street: faker.location.streetAddress(true),
            }),
            registration: faker.string.numeric(6).toString(),
            costCenter: faker.string.numeric(6).toString(),
            firstAccess: true,
            password: await bcrypt.hash('Denso', 10),
            admission: faker.date.past(),
            role: faker.company.name(),
            shift: '07:30 às 17:30',
            id: uuid(),
            createdAt: getDateInLocaleTime(new Date()),
          });
        }

        await this.pin.createMany({
          data: pins,
        });

        await this.employee.createMany({
          data: employees,
        });

        for (let i = 0; i < 6; i++) {
          await this.employeesOnPin.create({
            data: {
              employeeId: employees[i].id,
              pinId: pins[i].id,
              type: ETypePin.CONVENTIONAL,
            },
          });
        }

        const driverId = [];

        for (let i = 0; i < 2; i++) {
          driverId.push({
            id: uuid(),
            name: faker.person.fullName(),
            category: 'D',
            firstAccess: true,
            cnh: faker.string.numeric(11).toString(),
            createdAt: getDateInLocaleTime(new Date()),

            cpf: faker.string.numeric(11).toString(),
            password: await bcrypt.hash('Denso', 10),
            validation: faker.date.future(),
          });
        }

        await this.driver.createMany({
          data: driverId,
        });

        const vehicleId = [];

        for (let i = 0; i < 2; i++) {
          vehicleId.push({
            id: uuid(),
            capacity: +faker.string.numeric(2),
            expiration: faker.date.future(),
            lastMaintenance: faker.date.past(),
            note: faker.lorem.paragraph(),
            lastSurvey: faker.date.past(),
            plate: faker.vehicle.vrm(),
            renavam: faker.string.numeric(11).toString(),
            type: faker.vehicle.type(),
            isAccessibility: true,
            company: faker.company.name(),
            createdAt: getDateInLocaleTime(new Date()),
          });
        }

        await this.vehicle.createMany({
          data: vehicleId,
        });
      }
    }

    await this.driver.upsert({
      where: { id: process.env.DENSO_ID },
      create: {
        id: process.env.DENSO_ID,
        name: 'Motorista Denso',
        category: 'D',
        cnh: '12345678910',
        firstAccess: true,
        createdAt: getDateInLocaleTime(new Date()),
        cpf: '12345678910',
        password: await bcrypt.hash('Denso', 10),
        validation: faker.date.future(),
      },
      update: {
        name: 'Denso',
        category: 'D',
        cnh: '12345678910',
        cpf: '12345678910',
        password: await bcrypt.hash('Denso', 10),
      },
    });

    await this.vehicle.upsert({
      where: { id: process.env.DENSO_ID },
      create: {
        id: process.env.DENSO_ID,
        capacity: 32,
        expiration: faker.date.future(),
        lastMaintenance: faker.date.past(),
        note: faker.lorem.paragraph(),
        lastSurvey: faker.date.past(),
        plate: 'DEN5000',
        renavam: '12345678910',
        type: 'Van',
        isAccessibility: true,
        company: 'Denso',
        createdAt: getDateInLocaleTime(new Date()),
      },
      update: {
        id: process.env.DENSO_ID,
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
