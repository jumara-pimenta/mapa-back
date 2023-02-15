import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { mapboxApi } from '../../../integrations/api';
import IMapBoxServiceIntegration from './mapbox.service.integration.contract';
import { GetDistanceResponse } from './response/getDistance.response';

@Injectable()
export class MapBoxServiceIntegration implements IMapBoxServiceIntegration {
  async getDistance(payload: any): Promise<GetDistanceResponse> {
    try {
      const { data }: AxiosResponse<GetDistanceResponse> =
        await mapboxApi().get(
          `address${payload}?key=${process.env.MAPS_BOX_API_KEY}`,
        );
      return data;
    } catch (e) {
      new Logger('mapbox service integration').error('get distance', e);
      this.error('[mapbox service integration] get distance');
    }
  }

  private error(e?: string) {
    throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
  }
}
