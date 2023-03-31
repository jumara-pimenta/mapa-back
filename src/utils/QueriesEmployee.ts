import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { getDateStartToEndOfDay } from './Date';
import { ETypePath, ETypeRoute } from './ETypes';

export function generateQueryForEmployee(filters: FiltersEmployeeDTO) {
  const fields = {
    registration: () => ({
      registration: { contains: filters.registration },
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
      shift: { contains: filters.shift },
    }),
    costCenter: () => ({
      costCenter: filters.costCenter,
    }),
    name: () => ({
      name: { contains: filters.name },
    }),
    extra: () => {
      if (filters.extra) {
        return {
          employeeOnPath: {
            every: {
              path: {
                type: { not: ETypePath.RETURN },
                deletedAt: null,
                route: {
                  type: { not: ETypeRoute.EXTRA },
                  deletedAt: null,
                },
              },
            },
          },
        };
      }
    },
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
