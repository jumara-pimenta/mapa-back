export const ListRoutes = {
  total: 1,
  items: [
    {
      id: '35f83321-8892-4637-bb43-b395d0d817ea',
      description: 'Rota de teste',
      distance: '7.33 KM',
      status: 'PENDENTE',
      type: 'CONVENCIONAL',
      createdAt: '2023-02-13T19:56:11.276Z',
      driver: {
        id: 'bf869eb5-ca41-4e65-a36b-4f6fb2760dad',
        name: 'Tertuliano Nogueira',
        cpf: '76762928642',
        cnh: '62018760199',
        validation: '2023-09-07T06:05:33.791Z',
        category: 'D',
        createdAt: '2023-02-13T15:56:11.089Z',
        updatedAt: null,
      },
      vehicle: {
        id: '5e238a90-4b10-431f-bcaa-25a4a660507a',
        plate: 'XN20NVK',
        company: 'Souza, Reis e Melo',
        type: 'Convertible',
        lastSurvey: '2022-06-22T21:49:30.485Z',
        expiration: '2023-07-13T20:37:44.103Z',
        capacity: 75,
        renavam: '58069698571',
        lastMaintenance: '2022-07-20T21:34:11.289Z',
        note: 'Sit aliquam pariatur totam minus atque doloribus earum illo blanditiis.',
        isAccessibility: true,
        createdAt: '2023-02-13T15:56:11.140Z',
        updatedAt: null,
      },
      paths: [
        {
          id: '8a431e2a-255b-4ff1-ba69-e52ccdf34342',
          duration: '00:30',
          finishedAt: null,
          startedAt: null,
          startsAt: '08:00',
          status: 'PENDENTE',
          type: 'VOLTA',
          createdAt: '2023-02-13T19:56:11.294Z',
          employeesOnPath: [
            {
              id: '3b15b633-a2b2-4ec4-9c6b-41ca422934b9',
              boardingAt: null,
              confirmation: false,
              disembarkAt: null,
              position: 6,
              details: {
                name: 'Ana Clara Carvalho',
                location: {
                  lat: '-3.1376438100682718',
                  lng: '-59.988923509861465',
                },
              },
            },
            {
              id: '16d4c0c3-a731-4587-bdaa-ea38bac594e6',
              boardingAt: null,
              confirmation: false,
              disembarkAt: null,
              position: 5,
              details: {
                name: 'Meire Xavier',
                location: {
                  lat: '-3.138758531627776',
                  lng: '-59.98713727671988',
                },
              },
            },
          ],
        },
      ],
      quantityEmployees: 2,
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
  id: '5d8dacf7-ddf5-4ac0-a302-6a85e048398c',
  name: 'Marcos Paulo',
  cpf: '02157444525',
  cnh: '11111111111',
  password: '$2b$10$m0.v5CS50WhJeousFro7ROGjDqTHkCChvlWqsd9i7.9tqntJVHEe.',
  validation: '2022-11-09T17:46:10.037Z',
  category: 'AB',
  createdAt: '2023-01-31T15:05:31.564Z',
  updatedAt: null,
};

export const UpdateDriver = {
  ...CreateDriver,
  updatedAt: new Date(),
};

export const DeleteDriver = { ...UpdateDriver };

export const GetDriver = { ...UpdateDriver };

export const GetAllDriver = {
  total: 2,
  items: [
    {
      id: '3c14a5c6-66ba-4a01-aa09-863b2b80d9be',
      category: 'D',
      cnh: '35221688894',
      cpf: '27993014341',
      name: 'Enzo Gabriel Martins',
      validation: '2023-11-25T23:09:49.675Z',
      createdAt: '2023-02-13T19:38:21.491Z',
    },
    {
      id: '9784533d-f61a-46f5-88ab-2619d858d18e',
      category: 'D',
      cnh: '77944574042',
      cpf: '39289492053',
      name: 'Sophia Macedo',
      validation: '2023-03-12T11:33:10.218Z',
      createdAt: '2023-02-13T19:38:21.534Z',
    },
  ],
};

export const UploadFileDrivers = {
  newDriversCreated: 0,
  driversAlreadyExistent: 17,
  quantityDriversOnSheet: 17,
  errors: [],
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

export const UploadFileVehicles = {
  newVehiclesCreated: 0,
  vehiclesAlreadyExistent: 2,
  quantityVehiclesOnSheet: 2,
  errors: [],
};

export const GetAllVehicle = {
  total: 2,
  items: [
    {
      id: '1f969985-97b7-4877-a53c-76f538b6f523',
      capacity: 78,
      company: 'Silva EIRELI',
      expiration: '2023-05-19T12:18:29.431Z',
      isAccessibility: true,
      lastMaintenance: '2022-11-12T04:00:43.086Z',
      lastSurvey: '2022-09-29T21:05:07.691Z',
      note: 'Neque et ducimus reiciendis velit rerum neque quasi.',
      plate: 'XL34AKW',
      renavam: '44071565184',
      type: 'SUV',
      createdAt: '2023-02-13T19:38:21.582Z',
    },
    {
      id: '49a658e4-bc26-4ae9-a04a-703235f66a7b',
      capacity: 91,
      company: 'Albuquerque, Oliveira e Moreira',
      expiration: '2024-01-06T00:24:00.154Z',
      isAccessibility: true,
      lastMaintenance: '2023-01-23T16:00:25.146Z',
      lastSurvey: '2022-03-24T01:28:57.301Z',
      note: 'Optio fugiat magnam beatae.',
      plate: 'UL10FAO',
      renavam: '58092831672',
      type: 'SUV',
      createdAt: '2023-02-13T19:38:21.582Z',
    },
  ],
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
  total: 2,
  items: [
    {
      id: 'b826ec65-7fa2-4b46-a0be-83393b315c39',
      name: 'Maitê Franco Jr.',
      address: {
        cep: '27178488',
        city: 'Vitória de Nossa Senhora',
        complement: '',
        neighborhood: 'Quadra 64',
        number: '34504794',
        state: 'AM',
        street: '6040 Moreira Rua Quadra 35',
      },
      admission: '2022-06-18T13:33:25.784Z',
      costCenter: '256236',
      registration: '180621',
      role: 'Costa, Batista e Pereira',
      shift: '7',
      createdAt: '2023-02-13T10:03:17.333Z',
      pins: [
        {
          id: '6e767055-2003-4cbf-8926-3a711629be82',
          title: 'Lagoa Verde',
          local: 'Av. Rodrigo Otávio, 2 - São Lázaro, Manaus - AM, 69073-177',
          details: 'Em frente a Lagoa Verde',
          lat: '-3.1376438100682718',
          lng: '-59.988923509861465',
          type: 'CONVENCIONAL',
        },
      ],
    },
    {
      id: 'af1ad7dc-0023-430c-b25e-cae51db70361',
      name: 'Yango Barros',
      address: {
        cep: '31811537',
        city: 'undefined Ladislau',
        complement: '',
        neighborhood: 'Quadra 91',
        number: '14304413',
        state: 'AM',
        street: '20508 Moreira Travessa Sobrado 91',
      },
      admission: '2022-08-24T01:46:38.677Z',
      costCenter: '241447',
      registration: '105115',
      role: 'Oliveira, Moreira e Melo',
      shift: '8',
      createdAt: '2023-02-13T10:03:17.290Z',
      pins: [
        {
          id: '8ff7615e-4b7d-49b8-8f94-897ee9be4ea3',
          title: 'Patricia Bradock Fardas',
          local: 'R. das Águias, 40 - São Lázaro, Manaus - AM, 69073-140',
          details: 'Em frente a Patricia Bradock Fardas',
          lat: '-3.138758531627776',
          lng: '-59.98713727671988',
          type: 'CONVENCIONAL',
        },
      ],
    },
  ],
};

export const CreateEmployeesOnPin = {
  employeeId: '2e2b8886-5d93-4304-b00f-aa08e895865d',
  pinId: 'c0294d1c-5629-4969-90cb-36cc859685ae',
  type: 'CONVENCIONAL',
  createdAt: new Date(),
  updatedAt: null,
};

export const GetRouteHistories = {
  id: 'ae117ec0-6fa6-4c6e-b725-1fff6569aa59',
  typeRoute: 'IDA',
  nameRoute: 'Rota #002',
  pathId: 'be59edcd-e4f2-4221-8d18-0a16ef2fc514',
  employeeIds: '42b2b0c0-2e8c-4065-a01a-5096159ef72f',
  totalEmployees: 1,
  totalConfirmed: 1,
  driverId: '5d8dacf7-ddf5-4ac0-a302-6a85e048398c',
  vehicleId: '2f18a229-e9c9-405c-813d-b1b35b369d30',
  itinerary: '-3.1299786,-59.99308800000001',
  startedAt: '2023-01-31T11:21:02.797Z',
  finishedAt: '2023-01-31T15:21:11.508Z',
  createdAt: '2023-01-31T15:21:11.510Z',
  updatedAt: null,
};

export const ListRouteHistories = {};

export const GetRouteHistoriesByQuantity = {
  Pending: 0,
  Started: 0,
  Finished: 1,
};

export const GetRouteHistoriesByDate = {};

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

export const BackOfficeUserLogin = {
  id: 'b39d2fc8-63b0-4293-a95b-d8b14d8db310',
  name: 'Philip Pollich DVM',
  email: 'mark@ymail.com',
  role: 'ADMIN',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiJiMzlkMmZjOC02M2IwLTQyOTMtYTk1Yi1kOGIxNGQ4ZGIzMTAiLCJyb2xlIjoiQURNSU4ifSwicGVybWlzc2lvbnMiOlsiY3JlYXRlLWVtcGxveWVlIiwiZWRpdC1lbXBsb3llZSIsImRlbGV0ZS1lbXBsb3llZSIsImxpc3QtZW1wbG95ZWUiLCJsaXN0LWRyaXZlciIsImNyZWF0ZS1kcml2ZXIiLCJlZGl0LWRyaXZlciIsImRlbGV0ZS1kcml2ZXIiLCJsaXN0LXBhdGgiLCJjcmVhdGUtcGF0aCIsImVkaXQtcGF0aCIsImRlbGV0ZS1wYXRoIiwibGlzdC12ZWhpY2xlIiwiY3JlYXRlLXZlaGljbGUiLCJlZGl0LXZlaGljbGUiLCJkZWxldGUtdmVoaWNsZSIsImNyZWF0ZS1yb3V0ZSIsImVkaXQtcm91dGUiLCJkZWxldGUtcm91dGUiLCJsaXN0LXJvdXRlIl0sImlhdCI6MTY3Mzg4MDgyOSwiZXhwIjoxNjc0NDg1NjI5fQ.SWQip1XgRWBsDzLKE7ZvfWj7NrfiaIQ75OuVx_mVu9k',
};

export const BackOfficeUserCreate = {
  id: '28b41c76-9463-4e82-bad7-dd98e0a4ffff',
  name: 'Roy Ruecker',
  email: '2@ymail.com',
  role: 'ADMIN',
  createdAt: '2023-01-25T10:02:23.363Z',
  updatedAt: null,
};

export const CreateSinister = {
  id: '9b357440-f716-49a2-b4b7-83e65b72b1b5',
  type: 'Assalto',
  description: 'Assalto na parada de ônibus',
  pathId: 'a3ae6574-7f45-4c95-ac93-4b1c53ccd0fb',
  createdBy: '71b3e5f3-76e1-4dad-9638-7c9b4ad9dbcb',
  createdAt: '2023-01-26T20:15:45.137Z',
  updatedAt: null,
};

export const UpdateSinister = {
  ...CreateSinister,
  updatedAt: new Date(),
};

export const GetSinisterById = {
  id: '9b357440-f716-49a2-b4b7-83e65b72b1b5',
  type: 'Assalto',
  description: 'Assalto na parada de ônibus da Suframa',
  createdAt: '2023-01-26T20:15:45.137Z',
  updatedAt: null,
};

export const GetAllSinister = {
  total: 1,
  items: [
    {
      id: 'a3ae6574-7f45-4c95-ac93-4b1c53ccd0fb',
      type: 'Assalto',
      description: 'Assalto na parada de ônibus',
      createdAt: '2023-01-27T10:10:59.710Z',
    },
  ],
};
