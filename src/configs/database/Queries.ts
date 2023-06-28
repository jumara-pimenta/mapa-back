import { FiltersSinisterDTO } from '../../dtos/sinister/filtersSinister.dto';
import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { IQueryDriver } from '../../dtos/driver/queryDriver.dto';
import { IQueryEmployee } from '../../dtos/employee/queryEmployee.dto';
import { FiltersEmployeesOnPathDTO } from '../../dtos/employeesOnPath/filtersEmployeesOnPath.dto';
import { IQueryEmployeesOnPath } from '../../dtos/employeesOnPath/queryEmployeesOnPath.dto';
import { IQueryPath } from '../../dtos/path/queryPath.dto';
import { IQueryRouteHistory } from '../../dtos/routeHistory/queryRouteHistory.dto';
import { FiltersVehicleDTO } from '../../dtos/vehicle/filtersVehicle.dto';
import { IQueryVehicle } from '../../dtos/vehicle/queryVehicle.dto';
import { convertAndVerifyNumber } from '../../utils/Utils';
import { IQueryPin } from '../../dtos/pin/queryPin.dto';
import { FiltersRouteDTO } from '../../dtos/route/filtersRoute.dto';
import { ETypePath } from '../../utils/ETypes';
import { getDateStartToEndOfDay } from '../../utils/Date';
import { IQueryBackOfficeUser } from '../../dtos/auth/queryBackOfficeUser.dto';
import { FilterBackOfficeUserDTO } from '../../dtos/auth/filterBackOfficeUser.dto';
import { IQuerySinister } from '../../dtos/sinister/querySinister.dto';
import { FiltersPathDTO } from '../../dtos/path/filtersPath.dto';

export function generateQueryByFiltersForEmployee(
  filters: any,
): IQueryEmployee {
  const fields = {
    sequenceQr: () => ({
      sequenceQr: convertAndVerifyNumber(filters.sequenceQr),
    }),
    process: () => ({
      process: filters.process,
    }),
    type: () => ({
      type: filters.type,
    }),
    product: () => ({
      product: filters.product,
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForEmployeesOnPath(
  filters: FiltersEmployeesOnPathDTO,
): IQueryEmployeesOnPath {
  const fields = {
    boardingAt: () => ({
      boardingAt: filters.boardingAt,
    }),
    confirmation: () => ({
      confirmation: filters.confirmation,
    }),
    disembarkAt: () => ({
      disembarkAt: filters.disembarkAt,
    }),
    position: () => ({
      position: filters.position,
    }),
    employeeId: () => ({
      employee: {
        id: filters.employeeId,
      },
    }),
    pathId: () => ({
      path: {
        id: filters.pathId,
      },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: IQueryEmployeesOnPath;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForDriver(
  filters: FiltersDriverDTO,
): IQueryDriver {
  const fields = {
    name: () => ({
      name: { contains: filters.name },
    }),
    cpf: () => ({
      cpf: { contains: filters.cpf },
    }),
    cnh: () => ({
      cnh: { contains: filters.cnh },
    }),
    validation: () => {
      const { end, start } = getDateStartToEndOfDay(filters.validation);

      return {
        validation: {
          gte: start,
          lte: end,
        },
      };
    },
    category: () => ({
      category: filters.category,
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForVehicle(
  filters: FiltersVehicleDTO,
): IQueryVehicle {
  const fields = {
    plate: () => ({
      plate: { contains: filters.plate },
    }),
    company: () => ({
      company: { contains: filters.company },
    }),
    capacity: () => ({
      capacity: convertAndVerifyNumber(filters.capacity),
    }),
    type: () => ({
      type: filters.type,
    }),
    expiration: () => {
      const { end, start } = getDateStartToEndOfDay(filters.expiration);

      return {
        expiration: {
          gte: start,
          lte: end,
        },
      };
    },
    isAccessibility: () => ({
      isAccessibility: filters.isAccessibility == 'true' ? true : false,
    }),
    lastSurvey: () => {
      const { end, start } = getDateStartToEndOfDay(filters.lastSurvey);

      return {
        lastSurvey: {
          gte: start,
          lte: end,
        },
      };
    },
    lastMaintenance: () => {
      const { end, start } = getDateStartToEndOfDay(filters.lastMaintenance);

      return {
        lastMaintenance: {
          gte: start,
          lte: end,
        },
      };
    },

    note: () => ({
      note: { contains: filters.note },
    }),
    renavam: () => ({
      renavam: { contains: filters.renavam },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForRoute(
  filters: FiltersRouteDTO,
): IQueryVehicle {
  const fields = {
    type: () => ({
      type: filters.type,
    }),
    driver: () => ({
      driver: { name: { contains: filters.driver } },
    }),
    vehicle: () => ({
      vehicle: { plate: { contains: filters.vehicle } },
    }),
    description: () => ({
      description: { contains: filters.description },
    }),
    typePath: () =>
      filters.typePath == ETypePath.ROUND_TRIP ||
      filters.typePath == ETypePath.ROUND_TRIP.toLocaleLowerCase()
        ? {
            AND: [
              {
                path: {
                  some: {
                    type: ETypePath.ONE_WAY,
                  },
                },
              },
              {
                path: {
                  some: {
                    type: ETypePath.RETURN,
                  },
                },
              },
            ],
          }
        : { path: { some: { type: filters.typePath } } },

    startsAt: () => ({
      path: {
        some: {
          startsAt: {
            contains: filters.startsAt,
          },
        },
      },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}
export function generateQueryByFiltersForPaths(filters: FiltersPathDTO): any {
  const fields = {
    type: () => ({
      type: filters.type,
    }),
    status: () => ({
      status: filters.status,
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForRouteHistory(
  filters: any,
): IQueryRouteHistory {
  const fields = {
    nameRoute: () => ({
      nameRoute: { contains: filters.nameRoute },
    }),
    createdAt: () => {
      const { end, start } = getDateStartToEndOfDay(filters.createdAt);
      return {
        createdAt: {
          gte: start,
          lte: end,
        },
      };
    },

    driverName: () => ({ driver: { name: { contains: filters.driverName } } }),
    vehiclePlate: () => ({
      vehicle: { plate: { contains: filters.vehiclePlate } },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForPath(filters: any): IQueryPath {
  const fields = {
    sequenceQr: () => ({
      sequenceQr: convertAndVerifyNumber(filters.sequenceQr),
    }),
    process: () => ({
      process: filters.process,
    }),
    type: () => ({
      type: filters.type,
    }),
    product: () => ({
      product: filters.product,
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForPin(filters: any): IQueryPin {
  const fields = {
    sequenceQr: () => ({
      sequenceQr: convertAndVerifyNumber(filters.sequenceQr),
    }),
    process: () => ({
      process: filters.process,
    }),
    type: () => ({
      type: filters.type,
    }),
    product: () => ({
      product: filters.product,
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForUser(
  filters: FilterBackOfficeUserDTO,
): IQueryBackOfficeUser {
  const fields = {
    name: () => ({
      name: { contains: filters.name },
    }),
    email: () => ({
      email: { contains: filters.email },
    }),
    role: () => ({
      role: { contains: filters.role },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}

export function generateQueryByFiltersForSinister(
  filters: FiltersSinisterDTO,
): IQuerySinister {
  const fields = {
    type: () => ({
      type: { contains: filters.type },
    }),
    description: () => ({
      description: { contains: filters.description },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: any;

  // eslint-disable-next-line @typescript-eslint/ban-types
  let queryBuilder: Function;

  for (const filter in filters) {
    if (keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        const newCondition = queryBuilder();

        Object.assign(query, { ...newCondition });
      } else {
        query = queryBuilder();
      }
    }
  }

  return query;
}
