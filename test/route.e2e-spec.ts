import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { CreateRouteDTO } from '../src/dtos/route/createRoute.dto';
import { ETypePath, ETypeRoute, ETypeShiftRotue } from '../src/utils/ETypes';

const routeProps: CreateRouteDTO = {
  type: ETypeRoute.CONVENTIONAL,
  description: 'TESTE SCHEDULE_DATE',
  driverId: '03535a45-3ab8-415a-a1e4-55c343b5a59e',
  vehicleId: '1522c9cc-b0ad-450f-8f71-58ab98a3150f',
  employeeIds: [
    '19107561-1ccf-4993-9ef6-4fcaa8d1ca37',
    '3ec8e86c-1a4c-4fb0-b067-6b27d3a578ff',
  ],
  shift: ETypeShiftRotue.FIRST,
  pathDetails: {
    type: ETypePath.ONE_WAY,
    duration: '01:20',
    isAutoRoute: false,
  },
};

describe('Route Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('create conventional route', () => {
    it('should be able to create a conventional route', async () => {
      await request(app.getHttpServer())
        .post('/api/routes')
        .send(routeProps)
        .expect(201);
    });

    it('should be able to return an error if customer`s document already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .send(routeProps)
        .expect(409);

      expect(response.body.message).toEqual('document already exists');
    });
  });
});
