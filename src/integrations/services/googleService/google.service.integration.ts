import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Waypoints } from '../../../dtos/route/waypoints.dto';
import { googleApi } from '../../../integrations/api';
import { getDistrictGoogle } from '../../../utils/District';
import IGoogleServiceIntegration from './google.service.integration.contract';
import { RootObject } from './response/getLocation.response';
import { DirectionsResponseData } from './response/directions.response';

@Injectable()
export class GoogleApiServiceIntegration implements IGoogleServiceIntegration {
  async getLocation(payload: any): Promise<any> {
    try {
      const { data }: AxiosResponse<RootObject> = await googleApi().get(
        `/maps/api/geocode/json?address=${payload}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
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
      const url = `/maps/api/directions/json?origin=${payload.origin}&destination=${payload.destination}&waypoints=optimize%3Atrue|${payload.waypoints}&travelMode=${payload.travelMode}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const { data }: AxiosResponse<DirectionsResponseData> = await googleApi().get(url);

      return this.handleHttpResponse(data);
    } catch (e) {
      new Logger('googleApi service integration').error('get waypoints', e);
    }
  }

  private handleHttpResponse(data: DirectionsResponseData): DirectionsResponseData {

    if (data.error_message) {
      new Logger('googleApi service integration').error('get waypoints', data.error_message);
    }

    if (data?.status) {
      const { status } = data;

      if (status !== 'OK') {
        if (status == 'ZERO_RESULTS' || !data) {
          throw new HttpException(
            'Não foi possível traçar um trajeto entre os pontos. Verifique se o ponto dos colaboradores estão dentro do limite permitido!',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        if (status == 'REQUEST_DENIED') {
          new Logger('googleApi service integration').debug(
            data?.error_message,
            'get waypoints',
          );

          throw new HttpException(
            'Não foi possível traçar um trajeto entre os pontos. Ocorreu um erro na autenticação com o serviço de Mapas.',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      }
    }

    return data;
  }
}
