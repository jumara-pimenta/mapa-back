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

export const GetRoutesByDriver = {
  total: 1,
  items: [
    {
      id: '3798a30d-344a-4317-b904-57337fbf93f7',
      description: 'Rota #002',
      distance: 'EM PROCESSAMENTO',
      status: 'PENDENTE',
      type: 'CONVENCIONAL',
      createdAt: '2023-01-11T18:59:02.923Z',
      driver: {
        id: '566f9a5d-89e3-4e73-976f-e764d42de0fa',
        name: 'Marcolino Pereira',
        cpf: '03278555451',
        cnh: '11225512',
        validation: '2023-01-11T14:49:20.316Z',
        category: 'AB',
        createdAt: '2023-01-11T18:49:20.374Z',
        updatedAt: null,
      },
      vehicle: {
        id: '8325b66f-db3f-4bbc-91e4-e216f0a5e6eb',
        plate: 'OAC2215',
        company: 'Expresso',
        type: 'ÔNIBUS',
        lastSurvey: '2022-06-27T16:17:13.448Z',
        expiration: '2022-06-27T16:17:13.448Z',
        capacity: 28,
        renavam: '12452154111',
        lastMaintenance: '2023-01-11T18:50:32.533Z',
        note: 'Teste',
        isAccessibility: true,
        createdAt: '2023-01-11T14:50:32.540Z',
        updatedAt: null,
      },
      paths: [
        {
          id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
          duration: '01:30',
          finishedAt: null,
          startedAt: null,
          startsAt: '12:59',
          status: 'PENDENTE',
          type: 'IDA',
          createdAt: '2023-01-11T18:59:02.936Z',
          employeesOnPath: [
            {
              id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
              boardingAt: null,
              confirmation: false,
              disembarkAt: null,
              position: 1,
              details: {
                name: 'Davizinho',
                location: {
                  lat: '-3.107451943287261',
                  lng: '-59.99183873143272',
                },
              },
            },
          ],
        },
      ],
      quantityEmployees: 1,
    },
  ],
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

export const GetEmployeesOnPath = {
  boardingAt: null,
  confirmation: true,
  disembarkAt: null,
  position: 1,
  createdAt: '2023-01-11T18:59:02.950Z',
  details: {
    name: 'Davizinho',
    address:
      '{"cep":"69045700","city":"Manaus","complement":"Campos Eliseos","neighborhood":"Planalto","number":"14","state":"AM","street":"RUA LUSAKA"}',
    shift: '1º Turno',
    registration: '787745',
    location: {
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
    },
  },
};

export const GetEmmployeesOnPathByRoute = [
  {
    id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
    boardingAt: null,
    confirmation: false,
    disembarkAt: null,
    position: 1,
    createdAt: '2023-01-11T18:59:02.950Z',
    details: {
      name: 'Davizinho',
      address:
        '{"cep":"69045700","city":"Manaus","complement":"Campos Eliseos","neighborhood":"Planalto","number":"14","state":"AM","street":"RUA LUSAKA"}',
      shift: '1º Turno',
      registration: '787745',
      location: {
        lat: '-3.107451943287261',
        lng: '-59.99183873143272',
      },
    },
  },
];

export const UpdateConfirmationEmployeesOnPath = {
  id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
  pathId: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
  confirmation: true,
  position: 1,
  description: null,
  boardingAt: null,
  disembarkAt: null,
  createdAt: '2023-01-11T18:59:02.950Z',
  updatedAt: new Date(),
};

export const UpdateEmployeesOnPathById = {
  id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
  pathId: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
  confirmation: true,
  position: 1,
  description: null,
  boardingAt: null,
  disembarkAt: null,
  createdAt: '2023-01-11T18:59:02.950Z',
  updatedAt: new Date(),
};

export const UpdateConfirmationEmployeesOnPathById = {
  id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
  pathId: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
  confirmation: true,
  position: 1,
  description: null,
  boardingAt: null,
  disembarkAt: null,
  createdAt: '2023-01-11T18:59:02.950Z',
  updatedAt: new Date(),
};

export const UpdateEmployeeOnBoard = {
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: null,
  startedAt: null,
  startsAt: '12:59',
  status: 'PENDENTE',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  routeId: '3798a30d-344a-4317-b904-57337fbf93f7',
  employeesOnPins: [
    {
      position: 1,
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
      employees: [
        {
          id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
          name: 'Davizinho',
          registration: '787745',
          employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
          disembarkAt: null,
          boardingAt: '2023-01-12T11:08:08.701Z',
          confirmation: true,
        },
      ],
    },
  ],
};

export const UpdateEmployeeOffBoard = {
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: null,
  startedAt: null,
  startsAt: '12:59',
  status: 'PENDENTE',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  routeId: '3798a30d-344a-4317-b904-57337fbf93f7',
  employeesOnPins: [
    {
      position: 1,
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
      employees: [
        {
          id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
          name: 'Davizinho',
          registration: '787745',
          employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
          disembarkAt: '2023-01-12T11:18:55.933Z',
          boardingAt: '2023-01-12T11:08:08.701Z',
          confirmation: true,
        },
      ],
    },
  ],
};

export const UpdateEmployeeOnPathNotComming = {
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: null,
  startedAt: null,
  startsAt: '12:59',
  status: 'PENDENTE',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  routeId: '3798a30d-344a-4317-b904-57337fbf93f7',
  employeesOnPins: [
    {
      position: 1,
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
      employees: [
        {
          id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
          name: 'Davizinho',
          registration: '787745',
          employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
          disembarkAt: null,
          boardingAt: null,
          confirmation: false,
        },
      ],
    },
  ],
};

export const GetPathById = {
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: null,
  startedAt: null,
  startsAt: '12:59',
  status: 'PENDENTE',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  employeesOnPath: [
    {
      id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
      boardingAt: null,
      confirmation: false,
      disembarkAt: null,
      position: 1,
      details: {
        name: 'Davizinho',
        address:
          '{"cep":"69045700","city":"Manaus","complement":"Campos Eliseos","neighborhood":"Planalto","number":"14","state":"AM","street":"RUA LUSAKA"}',
        shift: '1º Turno',
        registration: '787745',
        location: {
          id: '1d7a860f-b354-4314-8d5d-2be01c232612',
          lat: '-3.107451943287261',
          lng: '-59.99183873143272',
        },
      },
    },
  ],
};

export const UpdatePathById = {
  id: '217822b9-02f2-47e7-9d90-1ae58744acc3',
  duration: '01:30',
  startsAt: '08:30',
  startedAt: null,
  finishedAt: null,
  type: 'IDA E VOLTA',
  status: 'PENDENTE',
  routeId: 'd485832a-3bc6-419f-817b-c2c1a94472be',
  createdAt: '2023-01-12T18:43:02.367Z',
  updatedAt: '2023-01-12T14:54:51.249Z',
};

export const GetPathByRoutes = [
  {
    id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
    routeDescription: 'Rota #002',
    duration: '01:30',
    finishedAt: null,
    startedAt: null,
    startsAt: '12:59',
    status: 'PENDENTE',
    type: 'IDA',
    createdAt: '2023-01-11T18:59:02.936Z',
    employeesOnPath: [
      {
        id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
        boardingAt: null,
        confirmation: false,
        disembarkAt: null,
        position: 1,
        details: {
          name: 'Davizinho',
          address:
            '{"cep":"69045700","city":"Manaus","complement":"Campos Eliseos","neighborhood":"Planalto","number":"14","state":"AM","street":"RUA LUSAKA"}',
          shift: '1º Turno',
          registration: '787745',
          location: {
            lat: '-3.107451943287261',
            lng: '-59.99183873143272',
          },
        },
      },
    ],
  },
];

export const GetPathByDriver = [
  {
    id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
    routeDescription: 'Rota #002',
    duration: '01:30',
    finishedAt: '2023-01-12T14:13:17.444Z',
    startedAt: '2023-01-12T14:10:18.084Z',
    startsAt: '12:59',
    status: 'FINALIZADO',
    type: 'IDA',
    createdAt: '2023-01-11T18:59:02.936Z',
    employeesOnPath: [
      {
        id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
        boardingAt: null,
        confirmation: false,
        disembarkAt: null,
        position: 1,
        details: {
          name: 'Davizinho',
          address:
            '{"cep":"69045700","city":"Manaus","complement":"Campos Eliseos","neighborhood":"Planalto","number":"14","state":"AM","street":"RUA LUSAKA"}',
          shift: '1º Turno',
          registration: '787745',
          location: {
            lat: '-3.107451943287261',
            lng: '-59.99183873143272',
          },
        },
      },
    ],
  },
];

export const GetPathByEmployee = [
  {
    id: '217822b9-02f2-47e7-9d90-1ae58744acc3',
    routeDescription: 'Rota #088',
    duration: '01:30',
    finishedAt: null,
    startedAt: null,
    startsAt: '08:30',
    status: 'PENDENTE',
    type: 'VOLTA',
    createdAt: '2023-01-12T18:43:02.367Z',
    employeesOnPath: [
      {
        id: 'c426d45d-eccc-4881-93d4-bec53e012809',
        boardingAt: null,
        confirmation: true,
        disembarkAt: null,
        position: 1,
        details: {
          name: 'João Doe',
          address:
            '{"cep":"69825","city":"Manaus","complement":"Test","neighborhood":"Coroado","number":"15","state":"AM","street":"Rua C","type":true}',
          shift: '1º Turno',
          registration: '1116',
          location: {
            lat: '-3.1299786',
            lng: '-59.99308800000001',
          },
        },
      },
    ],
  },
  {
    id: 'e76a6458-8db9-4df3-9d25-3212f68b2f82',
    routeDescription: 'Rota #088',
    duration: '01:30',
    finishedAt: null,
    startedAt: null,
    startsAt: '08:30',
    status: 'PENDENTE',
    type: 'IDA',
    createdAt: '2023-01-12T18:43:02.359Z',
    employeesOnPath: [
      {
        id: 'f2c61dfe-074c-49d1-8be0-12ed18debe57',
        boardingAt: null,
        confirmation: true,
        disembarkAt: null,
        position: 1,
        details: {
          name: 'João Doe',
          address:
            '{"cep":"69825","city":"Manaus","complement":"Test","neighborhood":"Coroado","number":"15","state":"AM","street":"Rua C","type":true}',
          shift: '1º Turno',
          registration: '1116',
          location: {
            lat: '-3.1299786',
            lng: '-59.99308800000001',
          },
        },
      },
    ],
  },
];

export const GetPathByDriverAndStatus = {
  id: 'b8f805f2-9a96-4822-9667-2b19cc344848',
  registration: '1116',
  name: 'João Doe',
  admission: '2022-11-09T17:46:04.310Z',
  role: 'auxiliar de produção',
  shift: '1º Turno',
  costCenter: 'Almoxarife',
  address: {
    cep: '69825',
    city: 'Manaus',
    complement: 'Test',
    neighborhood: 'Coroado',
    number: '15',
    state: 'AM',
    street: 'Rua C',
    type: true,
  },
  createdAt: '2023-01-12T14:40:45.357Z',
  updatedAt: null,
};

export const GetPathByEmployeeAndStatus = {
  id: '217822b9-02f2-47e7-9d90-1ae58744acc3',
  routeDescription: 'Rota #088',
  duration: '02h00',
  finishedAt: null,
  startedAt: null,
  startsAt: '08:30',
  status: 'PENDENTE',
  type: 'IDA E VOLTA',
  createdAt: '2023-01-12T18:43:02.367Z',
  employeesOnPath: [
    {
      id: 'c426d45d-eccc-4881-93d4-bec53e012809',
      boardingAt: null,
      confirmation: true,
      disembarkAt: null,
      position: 1,
      details: {
        name: 'João Doe',
        address:
          '{"cep":"69825","city":"Manaus","complement":"Test","neighborhood":"Coroado","number":"15","state":"AM","street":"Rua C","type":true}',
        shift: '1º Turno',
        registration: '1116',
        location: {
          id: 'n deu',
          lat: '-3.1299786',
          lng: '-59.99308800000001',
        },
      },
    },
  ],
};

export const GetPathByPins = {
  id: '217822b9-02f2-47e7-9d90-1ae58744acc3',
  routeDescription: 'Rota #088',
  duration: '02h00',
  finishedAt: null,
  startedAt: null,
  startsAt: '08:30',
  status: 'PENDENTE',
  type: 'IDA E VOLTA',
  createdAt: '2023-01-12T18:43:02.367Z',
  routeId: 'd485832a-3bc6-419f-817b-c2c1a94472be',
  employeesOnPins: [
    {
      position: 1,
      lat: '-87.8747474',
      lng: '-87.8747474',
      employees: [
        {
          id: 'c426d45d-eccc-4881-93d4-bec53e012809',
          name: 'João Doe',
          registration: '1116',
          employeeId: 'b8f805f2-9a96-4822-9667-2b19cc344848',
          disembarkAt: null,
          boardingAt: null,
          confirmation: true,
        },
      ],
    },
  ],
};

export const CreateStartPath = {
  vehicle: 'OAC2215',
  driver: 'Marcolino Pereira',
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: null,
  startedAt: '2023-01-12T14:10:18.084Z',
  startsAt: '12:59',
  status: 'EM ANDAMENTO',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  routeId: '3798a30d-344a-4317-b904-57337fbf93f7',
  employeesOnPins: [
    {
      position: 1,
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
      employees: [
        {
          id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
          name: 'Davizinho',
          registration: '787745',
          employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
          disembarkAt: null,
          boardingAt: null,
          confirmation: false,
        },
      ],
    },
  ],
};

export const CreateFinishPath = {
  vehicle: 'OAC2215',
  driver: 'Marcolino Pereira',
  id: 'f1dfa286-bdbd-47e0-97c2-d46b089e657d',
  routeDescription: 'Rota #002',
  duration: '01:30',
  finishedAt: '2023-01-12T14:13:17.444Z',
  startedAt: '2023-01-12T14:10:18.084Z',
  startsAt: '12:59',
  status: 'FINALIZADO',
  type: 'IDA',
  createdAt: '2023-01-11T18:59:02.936Z',
  routeId: '3798a30d-344a-4317-b904-57337fbf93f7',
  employeesOnPins: [
    {
      position: 1,
      lat: '-3.107451943287261',
      lng: '-59.99183873143272',
      employees: [
        {
          id: 'e6d0a6a5-e5fa-4f3e-a5c0-bce1370edb56',
          name: 'Davizinho',
          registration: '787745',
          employeeId: 'de54e9ee-9725-43bd-b928-1ef4610fce76',
          disembarkAt: null,
          boardingAt: null,
          confirmation: false,
        },
      ],
    },
  ],
};

export const DriverLogin = {
  id: '8d10e841-6bb7-4003-989e-b05011155a60',
  name: 'Angel Lindgren',
  cpf: '03325540740',
  cnh: '567115091',
  validation: '2023-01-23T16:52:01.325Z',
  category: 'B',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI4ZDEwZTg0MS02YmI3LTQwMDMtOTg5ZS1iMDUwMTExNTVhNjAiLCJuYW1lIjoiQW5nZWwgTGluZGdyZW4iLCJyb2xlIjoiRFJJVkVSIn0sInBlcm1pc3Npb25zIjpbImxpc3QtZHJpdmVyIiwibGlzdC1wYXRoIiwiZWRpdC1wYXRoIiwiZWRpdC1kcml2ZXIiLCJsaXN0LXZlaGljbGUiLCJlZGl0LXZlaGljbGUiLCJlZGl0LXJvdXRlIiwibGlzdC1yb3V0ZSJdLCJpYXQiOjE2NzQ1MDcyMjQsImV4cCI6MTY3NTExMjAyNH0.oS-cwbPI5T4nVZm_j9a1x114KYz2cQvTj8JOpZhQc9Y',
};

export const EmployeeLogin = {
  id: '71b3e5f3-76e1-4dad-9638-7c9b4ad9dbcb',
  registration: '96-750437-415126-6',
  name: 'Miss Rosa Stokes PhD',
  admission: '2023-01-23T18:34:26.810Z',
  role: 'auxiliar de produção',
  shift: '1º Turno',
  costCenter: 'Almoxarife',
  address: {
    cep: '69045700',
    city: 'Manaus',
    complement: '',
    neighborhood: 'Planalto',
    number: '140',
    state: 'AM',
    street: 'RUA LUSAKA',
  },
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI3MWIzZTVmMy03NmUxLTRkYWQtOTYzOC03YzliNGFkOWRiY2IiLCJuYW1lIjoiTWlzcyBSb3NhIFN0b2tlcyBQaEQiLCJyb2xlIjoiRU1QTE9ZRUUifSwicGVybWlzc2lvbnMiOlsibGlzdC1kcml2ZXIiLCJsaXN0LXBhdGgiLCJsaXN0LXZlaGljbGUiLCJsaXN0LXJvdXRlIl0sImlhdCI6MTY3NDUwNjQ4NiwiZXhwIjoxNjc1MTExMjg2fQ.PVsIM7DW3Y-NqAeu8Icmiyj6QHzfS3BhAyJyuDU6-jc',
};
