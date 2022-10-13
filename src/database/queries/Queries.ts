import { IQueryDriver } from "src/app/dtos/driver/queryDriver.dto";
import { DriverSearch } from "src/app/dtos/driver/searchDriver.dto"


export function generateQueryByFiltersForDrivers(filters: DriverSearch ){

  const fields = {
    name: () => ({
      name: {contains :filters.name},
    }),
    cpf: () => ({
      cpf: {contains: filters.cpf},
    }),
    cnh: () => ({
      cnh: {contains: filters.cnh},
    }),
    validation: () => ({
      validation: filters.validation,
    }),
    category: () => ({
      category: {contains:filters.category},
    }),
    createdAt: () => ({
      createdAt: filters.createdAt,
    }),
  }
  let query: IQueryDriver
  const keysFields = Object.keys(fields)

  let queryBuilder: Function

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
