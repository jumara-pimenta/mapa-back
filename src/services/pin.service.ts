import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pin } from '../entities/pin.entity';
import IPinRepository from '../repositories/pin/pin.repository.contract';
import { MappedPinDTO } from '../dtos/pin/mappedPin.dto';
import { CreatePinDTO } from '../dtos/pin/createPin.dto';
import { UpdatePinDTO } from '../dtos/pin/updatePin.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersPinDTO } from '../dtos/pin/filtersPin.dto';
import { ETypeEditionPin } from '../utils/ETypes';
import { EmployeesOnPinService } from './employeesOnPin.service';
import { Employee } from '../entities/employee.entity';

interface OptionsChangeEmployeePin {
  typeEdition: ETypeEditionPin;
  pinId?: string;
  employee: Employee;
}

@Injectable()
export class PinService {
  constructor(
    @Inject('IPinRepository')
    private readonly pinRepository: IPinRepository,
    private readonly employeeOnPinService: EmployeesOnPinService,
  ) {}

  async create(payload: CreatePinDTO): Promise<Pin> {
    return await this.pinRepository.create(new Pin(payload));
  }

  async changeEmployeePin(
    options: OptionsChangeEmployeePin,
    data: CreatePinDTO,
  ) {
    const { employee, typeEdition, pinId } = options;

    if (typeEdition === ETypeEditionPin.IS_EXISTENT) {
      if (!pinId)
        throw new HttpException(
          'O ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
          HttpStatus.BAD_REQUEST,
        );

      await this.employeeOnPinService.associateEmployeeByService(
        pinId,
        employee,
      );
    }

    if (typeEdition === ETypeEditionPin.IS_NEW) {
      const { title, local, details, lat, lng, district } = data;

      if (!title || !local || !details || !lat || !lng || !district) {
        throw new HttpException(
          'Todas as informações são obrigatórias alterar o ponto de embarque do colaborar para um novo: título, local, detalhes, latitude, longitude e distrito.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdPin = await this.create({
        title,
        local,
        details,
        district,
        lat,
        lng,
      });

      await this.employeeOnPinService.associateEmployeeByService(
        createdPin.id,
        employee,
      );
    }
  }

  validateUpdateEmployeePin(
    options: OptionsChangeEmployeePin,
    data: CreatePinDTO,
  ): void {
    const { typeEdition, pinId } = options;

    if (typeEdition === ETypeEditionPin.IS_EXISTENT) {
      if (!pinId)
        throw new HttpException(
          'O ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (typeEdition === ETypeEditionPin.IS_NEW) {
      const { title, local, details, lat, lng, district } = data;

      if (!title || !local || !details || !lat || !lng || !district) {
        throw new HttpException(
          'Todas as informações são obrigatórias alterar o ponto de embarque do colaborar para um novo: título, local, detalhes, latitude, longitude e distrito.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async delete(id: string): Promise<Pin> {
    const pin = await this.listById(id);

    return await this.pinRepository.delete(pin.id);
  }

  async listByLocal(local: string) {
    const pin = await this.pinRepository.findByLocal(local);

    if (!pin) {
      throw new HttpException(
        'O ponto de embarque não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }

    return pin;
  }

  async listByLocalExcel(local: string) {
    const pin = await this.pinRepository.findByLocalExcel(local);
    return pin;
  }

  async listAll(
    page: Page,
    filters?: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    const pins = await this.pinRepository.findAll(page, filters);

    if (pins.total === 0) {
      throw new HttpException(
        'Não existe pontos de embarque para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(pins.items);

    return {
      total: pins.total,
      items,
    };
  }

  async listById(id: string): Promise<Pin> {
    const pin = await this.pinRepository.findById(id);

    if (!pin)
      throw new HttpException(
        'O ponto de embarque não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );

    return pin;
  }

  async update(id: string, data: UpdatePinDTO): Promise<Pin> {
    const pin = await this.listById(id);

    return await this.pinRepository.update(
      Object.assign(pin, { ...pin, ...data }),
    );
  }

  private toDTO(pins: Pin[]): MappedPinDTO[] {
    return pins.map((pin) => {
      return {
        id: pin.id,
        title: pin.title,
        local: pin.local,
        details: pin.details,
        district: pin.district,
        lat: pin.lat,
        lng: pin.lng,
        createdAt: pin.createdAt,
      };
    });
  }
}
