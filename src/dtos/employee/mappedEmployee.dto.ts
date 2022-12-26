import { ETypePin } from '../../utils/ETypes';

export class MappedEmployeeDTO {
  id: string;
  name: string;
  registration: string;
  admission: Date;
  role: string;
  shift: string;
  costCenter: string;
  address: string;
  createdAt: Date;
  pins: {
    id: string;
    title: string;
    local: string;
    details: string;
    lat: string;
    lng: string;
    type: ETypePin;
  }[];
}
