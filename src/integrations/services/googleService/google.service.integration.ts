import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Waypoints } from '../../../dtos/route/waypoints.dto';
import { googleApi } from '../../../integrations/api';
import { getDistrictGoogle } from '../../../utils/District';
import IGoogleServiceIntegration from './google.service.integration.contract';
import { RootObject } from './response/getLocation.response';

@Injectable()
export class GoogleApiServiceIntegration implements IGoogleServiceIntegration {
  async getLocation(payload: any): Promise<any> {
    try {
      const { data }: AxiosResponse<RootObject> = await googleApi().get(
        `/maps/api/geocode/json?address=${payload}&key=${process.env.API_KEY_GOOGLE}`,
      );

      return {
        location: data.results[0]?.geometry?.location,
        district: getDistrictGoogle(data.results[0]?.address_components),
      };
    } catch (e) {
      new Logger('googleApi service integration').error('get location', e);
    }
  }

  async getWaypoints(payload: Waypoints): Promise<any> {
    try {
      const url = `/maps/api/directions/json?origin=${payload.origin}&destination=${payload.destination}&waypoints=optimize%3Atrue|${payload.waypoints}&travelMode=${payload.travelMode}&key=${process.env.API_KEY_GOOGLE}`;
      const { data }: AxiosResponse<RootObject> = await googleApi().get(url);
      return data;
    } catch (e) {
      new Logger('googleApi service integration').error('get waypoints', e);
    }
  }
}
