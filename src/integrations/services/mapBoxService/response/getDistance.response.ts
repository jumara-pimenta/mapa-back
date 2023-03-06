class WaypointsDTO {
  location: number[];
  name: string;
}

class LegsDTO {
  steps: any[];
  weight: number;
  distance: number;
  summary: string;
  duration: number;
}

class GeometryDTO {
  coordinates: number[][];
  type: string;
}

class RoutesDTO {
  legs: LegsDTO[];
  weight_name: string;
  geometry: GeometryDTO;
  country_crossed: boolean;
  weight: number;
  duration: number;
  distance: number;
}

export class GetDistanceResponse {
  waypoints: WaypointsDTO[];
  routes: RoutesDTO[];
  code: string;
}
