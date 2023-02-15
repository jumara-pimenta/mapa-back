import { RootObject } from './response/getLocation.response';

export default interface IGoogleServiceIntegration {
  getLocation(payload: any): Promise<RootObject>;
}
