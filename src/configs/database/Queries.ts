import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { IQueryDriver } from '../../dtos/driver/queryDriver.dto';
import { FiltersEmployeeDTO } from '../../dtos/employee/filtersEmployee.dto';
import { IQueryEmployee } from '../../dtos/employee/queryEmployee.dto';
import { FiltersEmployeesOnPathDTO } from '../../dtos/employeesOnPath/filtersEmployeesOnPath.dto';
import { IQueryEmployeesOnPath } from '../../dtos/employeesOnPath/queryEmployeesOnPath.dto';
import { FiltersPathDTO } from '../../dtos/path/filtersPath.dto';
import { IQueryPath } from '../../dtos/path/queryPath.dto';
import { FiltersPinDTO } from '../../dtos/pin/filtersPin.dto';
import { FiltersRouteHistoryDTO } from '../../dtos/routeHistory/filtersRouteHistory.dto';
import { IQueryRouteHistory } from '../../dtos/routeHistory/queryRouteHistory.dto';
import { FiltersVehicleDTO } from '../../dtos/vehicle/filtersVehicle.dto';
import { IQueryVehicle } from '../../dtos/vehicle/queryVehicle.dto';
import { convertAndVerifyNumber } from '../../utils/Utils';
import { IQueryPin } from '../../dtos/pin/queryPin.dto';

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

export function generateQueryByFiltersForDriver(filters: any): IQueryDriver {
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

export function generateQueryByFiltersForVehicle(filters: any): IQueryVehicle {
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

export function generateQueryByFiltersForRoute(filters: any): IQueryVehicle {
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
