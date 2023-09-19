import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { RouteService } from '../route.service';
import IRouteRepository from '../../repositories/route/route.repository.contract';
import { MapBoxServiceIntegration } from '../../integrations/services/mapBoxService/mapbox.service.integration';
import { GoogleApiServiceIntegration } from '../../integrations/services/googleService/google.service.integration';
import IScheduledWorkRepository from '../../repositories/scheduledWork/scheduledWork.repository.contract';
import { DriverService } from '../driver.service';
import { VehicleService } from '../vehicle.service';
import { EmployeeService } from '../employee.service';
import { PathService } from '../path.service';
import { RouteHistoryService } from '../routeHistory.service';
import { EmployeesOnPathService } from '../employeesOnPath.service';
import { CreateRouteDTO } from '../../dtos/route/createRoute.dto';
import { ETypePath, ETypeRoute, ETypeShiftRotue } from '../../utils/ETypes';

const createRouteProps: CreateRouteDTO = {
  type: ETypeRoute.CONVENTIONAL,
  description: 'CORRECAO CONFIRMACAO CONV.',
  driverId: '{{ _.driverId }}',
  vehicleId: '{{ _.vehicleId }}',
  employeeIds: [
    '0024cf65-457c-4471-bce9-f8d4b1fe04a1',
    '0045cc59-24ba-4fcd-9e86-1926af50d896',
  ],
  shift: ETypeShiftRotue.FIRST,
  pathDetails: {
    type: ETypePath.ROUND_TRIP,
    duration: '01:20',
    isAutoRoute: true,
  },
};

const routeRepositoryMock = createMock<IRouteRepository>();
const mapBoxServiceIntegrationMock = createMock<MapBoxServiceIntegration>();
const googleMapsServiceIntegrationMock =
  createMock<GoogleApiServiceIntegration>();
const scheduledWorkRepository = createMock<IScheduledWorkRepository>();

// External modules
const driverServiceMock = createMock<DriverService>();
const vehicleServiceMock = createMock<VehicleService>();
const employeeServiceMock = createMock<EmployeeService>();
const pathServiceMock = createMock<PathService>();
const routeHistoryServiceMock = createMock<RouteHistoryService>();
const employeesOnPathServiceMock = createMock<EmployeesOnPathService>();

describe('Route service', () => {
  let service: RouteService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteService,
        {
          useValue: routeRepositoryMock,
          provide: 'IRouteRepository',
        },
        {
          useValue: mapBoxServiceIntegrationMock,
          provide: MapBoxServiceIntegration,
        },
        {
          useValue: googleMapsServiceIntegrationMock,
          provide: 'ICustomerTicketRepository',
        },
        {
          useValue: scheduledWorkRepository,
          provide: 'IScheduledWorkRepository',
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
          useValue: employeeServiceMock,
          provide: EmployeeService,
        },
        {
          useValue: pathServiceMock,
          provide: PathService,
        },
        {
          useValue: routeHistoryServiceMock,
          provide: RouteHistoryService,
        },
        {
          useValue: employeesOnPathServiceMock,
          provide: EmployeesOnPathService,
        },
      ],
    }).compile();

    service = module.get<RouteService>(RouteService);
  });

  describe('create', () => {
    it('should create an route', async () => {
      const response = await service.create(createRouteProps);

      expect(response.description).toEqual(createRouteProps.description);
    });
  });
});
