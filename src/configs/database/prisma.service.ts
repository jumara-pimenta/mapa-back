import { faker } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDTO } from 'src/dtos/employee/createEmployee.dto';
import { Employee } from 'src/entities/employee.entity';
import { ETypePin } from 'src/utils/ETypes';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    const employees: any[] = [];

    const pin = await this.pin.create({
      data: {
        id: uuid(),
        title: 'Em Frente ao principe do açai',
        local: 'Príncipe do Açaí Frozen ',
        details: 'R. Paço Real, 144 - Raiz, Manaus - AM, 69068-650',
        lat: '-3.127925',
        lng: '-59.992930',
        createdAt: '2023-01-26T16:21:33.967Z',
      },
    });

    for (let i = 0; i < 12; i++) {
      employees.push({
        name: faker.name.fullName(),
        address: JSON.stringify({
          cep: '69045700',
          city: 'Manaus',
          complement: '',
          neighborhood: 'Planalto',
          number: '140',
          state: 'AM',
          street: 'RUA LUSAKA',
        }),
        registration: faker.random.numeric(6).toString(),
        costCenter: faker.random.numeric(6).toString(),
        password: await bcrypt.hash('Denso', 10),
        admission: faker.date.past(),
        role: faker.company.name(),
        shift: faker.random.numeric(1).toString(),
        id: uuid(),
        createdAt: new Date(),
        pins: {
          create: {
            type: ETypePin.CONVENTIONAL,
            pinId: pin.id,
          },
        },
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

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
