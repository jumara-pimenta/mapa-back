import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';

export function generateQueryForEmployee(
  filters: FiltersEmployeeDTO,
) {
  const fields = {
    registration: () => ({
      registration: filters.registration,
    }),
    admission: () => ({
      admission: filters.admission,
    }),
    role: () => ({
      role: filters.role,
    }),
    shift: () => ({
      shift: filters.shift,
    }),
    costCenter: () => ({
      costCenter: filters.costCenter,
    }),
    address: () => ({
      address: filters.address,
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
