import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
// import { addHour } from './Utils';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';

export function generateQueryForEmployee(
  filters: FiltersEmployeeDTO,
): MappedEmployeeDTO {
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

  let query: MappedEmployeeDTO;

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
