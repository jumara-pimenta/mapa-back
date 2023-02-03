import { GetDistanceResponse } from './response/getDistance.response';

export default interface IMapBoxServiceIntegration {
  getDistance(payload: any): Promise<GetDistanceResponse>;
}
