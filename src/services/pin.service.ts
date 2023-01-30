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

  async seed() {
    const pin = await this.pinRepository.findByLocal(
      'Denso Industrial da Amazônia',
    );

    if (pin) return;
    await this.create({
      details:
        'Av. Buriti, 3600 - Distrito Industrial I, Manaus - AM, 69075-000, Brasil',
      lat: '-3.1110442',
      lng: '-59.9623179',
      local: 'Denso Industrial da Amazônia',
      title: 'denso',
    });
  }

  async onModuleInit() {
    await this.seed();
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
        lat: pin.lat,
        lng: pin.lng,
        createdAt: pin.createdAt,
      };
    });
  }
}
