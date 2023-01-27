import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { getDateStartToEndOfDay } from './Date';

export function generateQueryForEmployee(filters: FiltersEmployeeDTO) {
  const fields = {
    registration: () => ({
      registration: filters.registration,
    }),
    admission: () => {
      const { start, end } = getDateStartToEndOfDay(filters.admission);
      return {
        admission: {
          gte: start,
          lte: end,
        },
      };
    },
    role: () => ({
      role: { contains: filters.role },
    }),
    shift: () => ({
      shift: filters.shift,
    }),
    costCenter: () => ({
      costCenter: filters.costCenter,
    }),
    name: () => ({
      name: { contains: filters.name },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: FiltersEmployeeDTO;

  let queryBuilder: () => FiltersEmployeeDTO;

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
