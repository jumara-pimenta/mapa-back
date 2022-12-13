import { MappedPinDTO } from './../dtos/pin/mappedPin.dto';
// import { addHour } from './Utils';
import { FiltersPinDTO } from 'src/dtos/pin/filtersPin.dto';

export function generateQueryForPins(filters: FiltersPinDTO): MappedPinDTO {
  const fields = {
    title: () => ({
      title: { contains: filters.title },
    }),
    local: () => ({
      local: { contains: filters.local },
    }),
    details: () => ({
      details: { contains: filters.details },
    }),
  };

  const keysFields = Object.keys(fields);

  let query: MappedPinDTO;

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
