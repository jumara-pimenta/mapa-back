import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { RouteService } from '../route.service';
import { DriverService } from '../driver.service';
import { VehicleService } from '../vehicle.service';
import { RouteHistoryService } from '../routeHistory.service';
import { EmployeesOnPathService } from '../employeesOnPath.service';
import IPathRepository from '../../repositories/path/path.repository.contract';
import { SinisterService } from '../sinister.service';
import { PathService } from '../path.service';

const pathRepositoryMock = createMock<IPathRepository>();

// External modules
const routeServiceMock = createMock<RouteService>();
const employeesOnPathServiceMock = createMock<EmployeesOnPathService>();
const driverServiceMock = createMock<DriverService>();
const vehicleServiceMock = createMock<VehicleService>();
const routeHistoryServiceMock = createMock<RouteHistoryService>();
const sinisterServiceMock = createMock<SinisterService>();

describe('Path service', () => {
  let service: PathService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PathService,
        {
          useValue: pathRepositoryMock,
          provide: 'IPathRepository',
        },
        {
          useValue: routeServiceMock,
          provide: RouteService,
        },
        {
          useValue: employeesOnPathServiceMock,
          provide: EmployeesOnPathService,
        },
        {
          useValue: driverServiceMock,
          provide: DriverService,
        },
        {
          useValue: vehicleServiceMock,
          provide: VehicleService,
        },
        {
          useValue: routeHistoryServiceMock,
          provide: RouteHistoryService,
        },
        {
          useValue: sinisterServiceMock,
          provide: SinisterService,
        },
      ],
    }).compile();

    service = module.get<PathService>(PathService);
  });

  describe('create', () => {
    it('should create an route', async () => {
      const response = await service.listAll();

      expect(response).toBeDefined();
    });
  });
});
