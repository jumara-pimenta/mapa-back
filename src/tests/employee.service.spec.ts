import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeesOnPinService } from '../services/employeesOnPin.service';
import { PinService } from '../services/pin.service';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import IEmployeeRepository from '../repositories/employee/employee.repository.contract';
import { createMock } from '@golevelup/ts-jest';
import { ETypeCreationPin } from '../utils/ETypes';

const createEmployee: CreateEmployeeDTO = {
  name: 'Teste',
  address: {
    street: 'Rua teste',
    cep: '12345678',
    number: '123',
    complement: 'teste',
    neighborhood: 'teste',
    city: 'teste',
    state: 'teste',
  },
  admission: new Date(),
  costCenter: 'teste',
  pin: {
    typeCreation: ETypeCreationPin.IS_NEW,
    details: 'teste',
    lat: '1',
    lng: '1',
    local: 'teste',
    title: 'teste',
  },
  role: 'teste',
  registration: 'teste1',
  shift: 'teste',
};

// const newEmployee = new Employee({
//   ...createEmployee,
//   password: bcrypt.hashSync(createEmployee.registration, 10),
//   address: JSON.stringify(createEmployee.address),
// });

let EmployeeRepositoryMock = createMock<IEmployeeRepository>();
let EmployeesOnPinServiceMock = createMock<EmployeesOnPinService>();
let PinServiceMock = createMock<PinService>();
describe('EmployeeService', () => {
  let employeeController: EmployeeController;
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [EmployeesOnPinModule, PinModule],
      providers: [
        EmployeeService,
        {
          provide: 'IEmployeeRepository',
          useValue: EmployeeRepositoryMock,
        },
        {
          provide: EmployeesOnPinService,
          useValue: EmployeesOnPinServiceMock,
        },
        {
          provide: PinService,
          useValue: PinServiceMock,
        },
      ],
      controllers: [EmployeeController],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    // employeeController = module.get<EmployeeController>(EmployeeController);
  });

  describe('Create a new Employee ', () => {
    it('should create a new employee', async () => {
      // jest
      //   .spyOn(EmployeeRepositoryMock, 'create')
      //   .mockResolvedValueOnce(newEmployee);

      const result = await service.create(createEmployee);
      expect(result.name).toEqual(createEmployee.name);
    });
  });
});
