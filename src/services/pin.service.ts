import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pin } from '../entities/pin.entity';
import IPinRepository from '../repositories/pin/pin.repository.contract';
import { MappedPinDTO } from '../dtos/pin/mappedPin.dto';
import { CreatePinDTO } from '../dtos/pin/createPin.dto';
import { UpdatePinDTO } from '../dtos/pin/updatePin.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersPinDTO } from '../dtos/pin/filtersPin.dto';

@Injectable()
export class PinService {
  constructor(
    @Inject('IPinRepository')
    private readonly pinRepository: IPinRepository,
  ) {}

  async create(payload: CreatePinDTO): Promise<Pin> {
    return await this.pinRepository.create(new Pin(payload));
  }

  async delete(id: string): Promise<Pin> {
    const pin = await this.listById(id);

    return await this.pinRepository.delete(pin.id);
  }

  async listAll(
    page: Page,
    filters?: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    const pins = await this.pinRepository.findAll(page, filters);

    if (pins.total === 0) {
      throw new HttpException(
        'Não existe Pins para esta pesquisa!',
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
        `Não foi encontrado um pin com o id: ${id}`,
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
        lat: pin.lat,
        lng: pin.lng,
        createdAt: pin.createdAt,
      };
    });
  }
}
