export const ListRoutes = {
  total: 2,
  items: [
    {
      id: '68b6ba41-4503-425e-85e6-7c5b8915fb15',
      name: 'Abraham Davis',
      address: 'Rua das Sorvas, 56. Coroado. Manaus - AM. 69082-476',
      admission: '2023-01-03T14:34:39.362Z',
      costCenter: 'Almoxarife',
      registration: '32-452074-657714-3',
      role: 'auxiliar de produção',
      shift: '1º Turno',
      createdAt: '2023-01-03T10:34:39.463Z',
      pins: [
        {
          id: '8ce47810-4106-429c-9e5d-17e110f852fa',
          title: 'RUA LUZAKA12',
          local: 'OPAPA',
          details: ' ali perto',
          lat: '0.0000000',
          lng: '0.000000',
          type: 'CONVENCIONAL',
        },
      ],
    },
    {
      id: '9551bda9-25e9-4db3-92a9-fe5ae7208e59',
      name: 'Marcus Vinicius',
      address: {
        cep: '66166155',
        city: 'Beatriz do Norte',
        complement: 'Moraes Rua',
        neighborhood: 'Arthur Avenida',
        number: '1282',
        state: 'Pará',
        street: 'Reis Rodovia',
      },
      admission: '2023-01-03T14:01:20.498Z',
      costCenter: 'Almoxarife',
      registration: '123456789',
      role: 'Auxiliar de produção',
      shift: '1º Turno',
      createdAt: '2023-01-03T10:06:02.132Z',
      pins: [
        {
          id: 'c30b1f44-be06-4209-abc3-e2359d5f0709',
          title: 'Título do local',
          local:
            'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
          details: 'Detalhes do local',
          lat: '-3.10719',
          lng: '-60.0261',
          type: 'CONVENCIONAL',
        },
      ],
    },
  ],
};

export const CreateRoute = {
  id: '644a4b19-6133-4506-b4f7-216fb3ffd7e7',
  description: 'Rota 1',
  distance: 'EM PROCESSAMENTO',
  type: 'CONVENCIONAL',
  status: 'PENDENTE',
  driverId: '05e7ce8b-b3e2-4295-b584-8e2caae2d809',
  vehicleId: '41b4eb3d-e18a-4c8e-a668-49824b21579c',
  createdAt: '2023-01-02T12:21:09.946Z',
  updatedAt: null,
  deletedAt: null,
};

export const UpdateRoute = {
  ...CreateRoute,
  updatedAt: new Date(),
};

export const DeleteRoute = {
  id: '39742d0c-1e64-4ee5-82c4-8efd1b6ceed2',
  description: 'Rota #CONVE',
  distance: 'EM PROCESSAMENTO',
  type: 'CONVENCIONAL',
  status: 'deleted',
  driverId: '881e7ba1-ae65-4601-aa3e-ca3c45cbdd59',
  vehicleId: 'aa6b8deb-ee13-44a1-ab66-76f6fc655e26',
  createdAt: '2023-01-03T15:20:27.354Z',
  updatedAt: null,
  deletedAt: new Date(),
};

export const CreateDriver = {
  id: 'dc0e9792-f935-4411-a016-de4509d55054',
  name: 'João da Silva',
  cpf: '96893908563',
  cnh: '123456789',
  // add year to date to avoid error
  validation: new Date(Date.now() + 31536000000),
  category: 'AB',
  createdAt: new Date(),
  updatedAt: null,
};

export const UpdateDriver = {
  ...CreateDriver,
  updatedAt: new Date(),
};

export const DeleteDriver = { ...UpdateDriver };

export const GetDriver = { ...UpdateDriver };

export const GetAllDriver = {
  total: 1,
  items: [{ ...UpdateDriver }],
};

export const CreateVehicle = {
  id: 'af036f4e-bfcf-4994-ab50-f167ee908f4e',
  plate: 'PHP1234',
  company: 'Expresso',
  type: 'ÔNIBUS',
  lastSurvey: new Date(),
  expiration: new Date(),
  capacity: 28,
  renavam: '12345678901',
  lastMaintenance: new Date(),
  note: 'Teste',
  isAccessibility: true,
  createdAt: new Date(),
  updatedAt: null,
};

export const UpdateVehicle = {
  ...CreateVehicle,
  updatedAt: new Date(),
};

export const DeleteVehicle = { ...UpdateVehicle };

export const GetVehicle = { ...UpdateVehicle };

export const GetAllVehicle = {
  total: 1,
  items: [{ ...UpdateVehicle }],
};

export const CreatePin = {
  id: '52c6a405-0d98-42e7-86e0-95cabee5812f',
  title: 'Título do local',
  local: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
  details: 'Detalhes do local',
  lat: '-60.0261',
  lng: '-3.10719',
  createdAt: new Date(),
  updatedAt: null,
};

export const UpdatePin = { ...CreateDriver, updatedAt: new Date() };

export const DeletePin = { ...UpdatePin };

export const GetPin = { ...UpdatePin };

export const GetAllPin = {
  total: 1,
  items: [{ ...UpdatePin }],
};

export const CreateEmployee = {
  id: '2fce27dd-e7c4-496f-be0e-3aac0db2f82d',
  registration: '123456789',
  name: 'Marcus Vinicius',
  admission: '2023-01-02T14:27:56.507Z',
  role: 'Auxiliar de produção',
  shift: '1º Turno',
  costCenter: 'Almoxarife',
  address: {
    cep: '69045700',
    city: 'Manaus',
    complement: 'Campos Eliseos',
    neighborhood: 'Planalto',
    number: '140',
    state: 'AM',
    street: 'RUA LUSAKA',
  },
  createdAt: '2023-01-02T10:28:31.580Z',
  updatedAt: null,
};

export const UpdateEmployee = {
  ...CreateEmployee,
  updatedAt: new Date(),
  role: 'desenvolvedor de software',
};

export const DeleteEmployee = { ...UpdateEmployee };

export const GetEmployee = { ...UpdateEmployee };

export const GetAllEmployee = {
  total: 1,
  items: [{ ...UpdateEmployee }],
};

export const CreateEmployeesOnPin = {
  employeeId: '2e2b8886-5d93-4304-b00f-aa08e895865d',
  pinId: 'c0294d1c-5629-4969-90cb-36cc859685ae',
  type: 'CONVENCIONAL',
  createdAt: new Date(),
  updatedAt: null,
};

export const GetRouteHistories = {
  id: '644a4b19-6133-4506-b4f7-216fb3ffd7e7',
  employeeIds:
    '2fce27dd-e7c4-496f-be0e-3aac0db2f82d, 644a4b19-6133-4506-b4f7-216fb3ffd7e7',
  route: '',
  startedAt: '2023-01-02T10:28:31.580Z',
  finishedAt: '2023-01-02T10:28:31.580Z',
  createdAt: '2023-01-02T10:28:31.580Z',
  updatedAt: null,
};
