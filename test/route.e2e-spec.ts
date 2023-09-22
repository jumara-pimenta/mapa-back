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
import supertest from 'supertest';

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

const registration = '78782';

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
    registration,
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
  let server;
  let tokenJWT;
  let httpSender: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    server = app.getHttpServer();

    const loginAdmin = await request(server)
      .post('/api/auth/backoffice/signin')
      .send({
        email: 'adm@rotas.com.br',
        password: 'Denso',
      });

    tokenJWT = loginAdmin.body.token;

    httpSender = request(server);
  });

  beforeEach(async () => {
    for await (const employee of employees) {
      const createdEmployee = await httpSender
        .post('/api/employees')
        .send(employee)
        .set('Authorization', `Bearer ${tokenJWT}`);

      routeProps.employeeIds.push(createdEmployee.body.id);
    }

    const createdVehicle = await httpSender
      .post('/api/vehicles')
      .send(vehicleProps)
      .set('Authorization', `Bearer ${tokenJWT}`);

    routeProps.vehicleId = createdVehicle.body.id;

    const createdDriver = await httpSender
      .post('/api/drivers')
      .send(driverProps)
      .set('Authorization', `Bearer ${tokenJWT}`);

    routeProps.driverId = createdDriver.body.id;
  });

  afterEach(async () => {
    await prismaService.route.deleteMany();
    await prismaService.employee.deleteMany();
    await prismaService.vehicle.deleteMany();
    await prismaService.driver.deleteMany();
    routeProps.employeeIds = [];
  });

  describe('GET /api/routes/paths/get/all', () => {
    it('should be able to list only routes from today', async () => {
      const response = await httpSender
        .get('/api/routes/paths/get/all')
        .set('Authorization', `Bearer ${tokenJWT}`);

      const today = moment().format('YYYY-MM-DD');

      const paths = response.body;

      for (const path of paths) {
        expect(moment(path.scheduledDate).format('YYYY-MM-DD')).toBe(today);
      }
    });
  });

  describe('GET /api/routes/paths/:id', () => {
    it('should be able to not list employees who have disconfirmed their presence on the route', async () => {
      const createdRoute = await httpSender
        .post('/api/routes')
        .send(routeProps)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const routeId = createdRoute.body.id;

      const routeById = await httpSender
        .get(`/api/routes/${routeId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const pathId = routeById.body.paths[0].id;
      const employeeOnPath = routeById.body.paths[0].employeesOnPath.find(
        (eop) => eop.details.registration !== registration,
      );

      const employeeOnPathId = employeeOnPath.id;

      const disconfirmationPayload = {
        confirmation: false,
      };

      // Listar o trajeto com todos confirmados
      const listedPathBeforeDisconfirmingEmployee = await request(server)
        .get(`/api/routes/paths/${pathId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      // Desconfirmar presenca do colaborador
      const disconfimedEmployeeResponse = await httpSender
        .put(`/api/routes/paths/employees/confirm/${employeeOnPathId}`)
        .send(disconfirmationPayload)
        .set('Authorization', `Bearer ${tokenJWT}`);

      expect(disconfimedEmployeeResponse.statusCode).toBe(200);
      expect(disconfimedEmployeeResponse.body.confirmation).toBe(
        disconfirmationPayload.confirmation,
      );
      // Listar trajeto sem o colaborador
      const listedAfterDisconfirmingEmployee = await httpSender
        .get(`/api/routes/paths/${pathId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const employeeBeforeDisconfirmation =
        listedPathBeforeDisconfirmingEmployee.body.employeesOnPath.find(
          (employee) => employee.id === employeeOnPathId,
        );
      expect(employeeBeforeDisconfirmation).toBeDefined();

      // Verificar se o colaborador não está na lista após a desconfirmação
      const employeeAfterDisconfirmation =
        listedAfterDisconfirmingEmployee.body.employeesOnPath.find(
          (employee) => employee.id === employeeOnPathId,
        );
      expect(employeeAfterDisconfirmation).toBeUndefined();
    });

    it('should be able to relist employees who confirmed their presence on the route', async () => {
      // Criacao e listagem da rota

      const createdRoute = await httpSender
        .post('/api/routes')
        .send(routeProps)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const routeId = createdRoute.body.id;

      const routeById = await httpSender
        .get(`/api/routes/${routeId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const pathId = routeById.body.paths[0].id;
      const employeeOnPath = routeById.body.paths[0].employeesOnPath.find(
        (eop) => eop.details.registration !== registration,
      );
      const employeeOnPathId = employeeOnPath.id;
      const disconfirmationPayload = {
        confirmation: false,
      };
      const confirmationPayload = {
        confirmation: true,
      };

      // Listagem de trajeto: Antes de desconfirmar um colaborador
      const listedPathBeforeDisconfirmation = await request(server)
        .get(`/api/routes/paths/${pathId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      // Desconfirmar presenca do colaborador
      const disconfirmedEmployeeResponse = await httpSender
        .put(`/api/routes/paths/employees/confirm/${employeeOnPathId}`)
        .send(disconfirmationPayload)
        .set('Authorization', `Bearer ${tokenJWT}`);

      expect(disconfirmedEmployeeResponse.statusCode).toBe(200);
      expect(disconfirmedEmployeeResponse.body.confirmation).toBe(
        disconfirmationPayload.confirmation,
      );

      // Listagem de trajeto: Depois de desconfirmar um colaborador
      const listedPathAfterDisconfirmation = await httpSender
        .get(`/api/routes/paths/${pathId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      // Confirmar novamente a presenca do colaborador
      const confirmedEmployeeResponse = await httpSender
        .put(`/api/routes/paths/employees/confirm/${employeeOnPathId}`)
        .send(confirmationPayload)
        .set('Authorization', `Bearer ${tokenJWT}`);

      expect(confirmedEmployeeResponse.statusCode).toBe(200);
      expect(confirmedEmployeeResponse.body.confirmation).toBe(
        confirmationPayload.confirmation,
      );

      // Listagem de trajeto: Depois de reconfirmar colaborador
      const listedPathAfterConfirmationAgain = await httpSender
        .get(`/api/routes/paths/${pathId}`)
        .set('Authorization', `Bearer ${tokenJWT}`);

      const employeeBeforeDisconfirmation =
        listedPathBeforeDisconfirmation.body.employeesOnPath.find(
          (employee) => employee.id === employeeOnPathId,
        );
      expect(employeeBeforeDisconfirmation).toBeDefined();

      const employeeAfterDisconfirmation =
        listedPathAfterDisconfirmation.body.employeesOnPath.find(
          (employee) => employee.id === employeeOnPathId,
        );
      expect(employeeAfterDisconfirmation).toBeUndefined();

      const employeeAfterConfirmationAgain =
        listedPathAfterConfirmationAgain.body.employeesOnPath.find(
          (employee) => employee.id === employeeOnPathId,
        );
      expect(employeeAfterConfirmationAgain).toBeDefined();
    });
  });
});
