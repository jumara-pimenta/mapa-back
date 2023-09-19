import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { CreateRouteDTO } from '../src/dtos/route/createRoute.dto';
import {
  ETypeCategoryDrivers,
  ETypeCreationPin,
  ETypePath,
  ETypeRoute,
  ETypeShiftEmployee,
  ETypeShiftRotue,
} from '../src/utils/ETypes';
import { CreateEmployeeDTO } from '../src/dtos/employee/createEmployee.dto';
import { CreateDriverDTO } from '../src/dtos/driver/createDriver.dto';
import { CreateVehicleDTO } from '../src/dtos/vehicle/createVehicle.dto';
import { PrismaService } from '../src/configs/database/prisma.service';
import moment from 'moment';

const routeProps: CreateRouteDTO = {
  type: ETypeRoute.CONVENTIONAL,
  description: 'Rota de teste criada',
  driverId: '',
  vehicleId: '',
  employeeIds: [],
  shift: ETypeShiftRotue.FIRST,
  pathDetails: {
    type: ETypePath.ROUND_TRIP,
    duration: '01:20',
    isAutoRoute: false,
  },
  scheduleDate: '2023-09-20',
};

const driverProps: CreateDriverDTO = {
  name: 'John Doe Driver',
  cpf: '48484845518',
  cnh: '55444544479',
  category: ETypeCategoryDrivers.D,
  validation: new Date('2023-06-29T00:00:00.000Z'),
};

const vehicleProps: CreateVehicleDTO = {
  type: 'Ônibus',
  capacity: 32,
  company: 'SENATUR',
  expiration: '2023-06-30T00:00:00.000Z',
  isAccessibility: false,
  note: 'TESTE ROUTE HISTORY',
  plate: 'QZO8B17',
  renavam: '44444444446',
};

const employees: CreateEmployeeDTO[] = [
  {
    name: 'JOHN DOE TESTE1',
    registration: '78781',
    admission: new Date('2023-08-23T00:00:00.000Z'),
    role: 'DEV',
    shift: ETypeShiftEmployee.FIRST,
    address: {
      cep: '69082476',
      city: 'Manaus',
      complement: '',
      neighborhood: 'Coroado',
      number: '115',
      state: 'AM',
      street: 'Rua das Castanholas',
    },
    costCenter: '15420',
    pin: {
      typeCreation: ETypeCreationPin.IS_NEW,
      title: 'ATACK COROADO',
      details:
        'Av. Cosme Ferreira, 3700 - Coroado III, Manaus - AM, 69083-000, Brazil',
      local: 'Atack - Coroado',
      lat: '-3.0751578',
      lng: '-59.9649461',
      district: ' Coroado III',
    },
  },
  {
    name: 'JOHN DOE II',
    registration: '78782',
    admission: new Date('2023-08-23T00:00:00.000Z'),
    role: 'DEV',
    shift: ETypeShiftEmployee.FIRST,
    address: {
      cep: '69082476',
      city: 'Manaus',
      complement: '',
      neighborhood: 'Coroado',
      number: '115',
      state: 'AM',
      street: 'Rua das Castanholas',
    },
    costCenter: '15420',
    pin: {
      typeCreation: ETypeCreationPin.IS_NEW,
      title: 'ATACK COROADO',
      details:
        'Av. Cosme Ferreira, 3700 - Coroado III, Manaus - AM, 69083-000, Brazil',
      local: 'Atack - Coroado',
      lat: '-3.0751578',
      lng: '-59.9649461',
      district: ' Coroado III',
    },
  },
];

describe('Route Controller (e2e)', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeAll(async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/backoffice/signin')
      .send({
        email: 'adm@rotas.com.br',
        password: 'Denso',
      });

    for await (const employee of employees) {
      const createdEmployee = await request(app.getHttpServer())
        .post('/api/employees')
        .send(employee)
        .set('Authorization', `Bearer ${login.body.token}`);

      routeProps.employeeIds.push(createdEmployee.body.id);
    }

    const createdVehicle = await request(app.getHttpServer())
      .post('/api/vehicles')
      .send(vehicleProps)
      .set('Authorization', `Bearer ${login.body.token}`);

    routeProps.vehicleId = createdVehicle.body.id;

    const createdDriver = await request(app.getHttpServer())
      .post('/api/drivers')
      .send(driverProps)
      .set('Authorization', `Bearer ${login.body.token}`);

    routeProps.driverId = createdDriver.body.id;
  });

  // beforeEach(async () => {
  // await prismaService.route.deleteMany();
  // });

  describe('create conventional route', () => {
    it('should be able to list all employees', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/backoffice/signin')
        .send({
          email: 'adm@rotas.com.br',
          password: 'Denso',
        });

      const response = await request(app.getHttpServer())
        .get('/api/employees')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('items');
    });

    it('should be able to create a conventional route', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/backoffice/signin')
        .send({
          email: 'adm@rotas.com.br',
          password: 'Denso',
        });

      const response = await request(app.getHttpServer())
        .post('/api/routes')
        .send(routeProps)
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(response.statusCode).toBe(201);
    });

    it('should be able to list path today', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/backoffice/signin')
        .send({
          email: 'adm@rotas.com.br',
          password: 'Denso',
        });

      const response = await request(app.getHttpServer())
        .get('/api/routes/paths/get/all')
        .set('Authorization', `Bearer ${login.body.token}`);

      const today = moment().format('YYYY-MM-DD'); // Obtém a data atual no formato 'YYYY-MM-DD'

      console.log('today is:', today);

      // Verifica se todos os trajetos na resposta têm a propriedade scheduledDate igual à data atual
      const paths = response.body;

      if (paths.length > 0) {
        paths[0].scheduledDate = new Date('2023-09-20T17:30:00.000Z'); // Defina uma data diferente da data atual
      }

      for (const path of paths) {
        console.log('path alterado', path);

        console.log(
          'novo today:',
          moment(path.scheduledDate).format('YYYY-MM-DD'),
        );

        expect(moment(path.scheduledDate).format('YYYY-MM-DD')).toBe(today);
      }
      // expect(response.statusCode).toBe(200);
    });
  });
});
