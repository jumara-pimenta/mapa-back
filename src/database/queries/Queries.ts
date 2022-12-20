import { IQueryDriver } from '../../dtos/driver/queryDriver.dto';
import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { FiltersPathDTO } from '../../dtos/path/filtersPath.dto';
import { IQueryPath } from '../../dtos/path/queryPath.dto';

export function generateQueryByFiltersForDrivers(filters: FiltersDriverDTO) {
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
    validation: () => ({
      validation: filters.validation,
    }),
    category: () => ({
      category: { contains: filters.category },
    }),
  };
  let query: IQueryDriver;
  const keysFields = Object.keys(fields);

  let queryBuilder: Function;

  for (const filter in filters) {
    if (filters[filter] && keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        return Object.assign(query, queryBuilder());
      }

      query = queryBuilder();
    }
  }

  return query;
}

export function generateQueryForPaths(filters: FiltersPathDTO): IQueryPath {
  let query: IQueryPath;

  const fields = {
    status: () => ({
      status: filters.status,
    }),
    duration: () => ({ 
      duration: filters.duration,
    }),
    finishedAt: () => ({ 
      finishedAt: filters.finishedAt
    }),
    startedAt: () => ({ 
      startedAt: filters.startedAt,
    }),
    startsAt: () => ({ 
      startsAt: filters.startsAt,
    }),
    type: () => ({ 
      type: filters.type,
    }),
  };
  
  const keysFields = Object.keys(fields);

  let queryBuilder: Function;

  for (const filter in filters) {
    if (filters[filter] && keysFields.includes(filter)) {
      queryBuilder = fields[filter];

      if (query) {
        return Object.assign(query, queryBuilder());
      }

      query = queryBuilder();
    }
  }

  return query;
}
