import { Page, PageResponse } from '../configs/database/page.model';
import { Sinister } from '../entities/sinister.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSinisterDTO } from '../dtos/sinister/createSinister.dto';
import { UpdateSinisterDTO } from '../dtos/sinister/updateSinister.dto';
import ISinisterRepository from '../repositories/sinister/sinister.repository.contract';
import { FiltersSinisterDTO } from '../dtos/sinister/filtersSinister.dto';
import { MappedSinisterDTO } from '../dtos/sinister/mappedSinister.dto';

@Injectable()
export class SinisterService {
  constructor(
    @Inject('ISinisterRepository')
    private readonly sinisterRepository: ISinisterRepository,
  ) {}

  async create(payload: CreateSinisterDTO): Promise<Sinister> {
    return await this.sinisterRepository.create(new Sinister(payload));
  }

  async listById(id: string): Promise<Sinister> {
    const sinister = await this.sinisterRepository.findById(id);

    if (!sinister)
      throw new HttpException(
        'O sinistro não foi encontrado!',
        HttpStatus.NOT_FOUND,
      );

    return sinister;
  }

  async update(id: string, data: UpdateSinisterDTO): Promise<Sinister> {
    const sinister = await this.listById(id);

    return await this.sinisterRepository.update(
      Object.assign(sinister, { ...sinister, ...data }),
    );
  }

  async listAll(
    page: Page,
    filters?: FiltersSinisterDTO,
  ): Promise<PageResponse<MappedSinisterDTO>> {
    const sinisters = await this.sinisterRepository.findAll(page, filters);

    if (sinisters.total === 0) {
      throw new HttpException(
        'Não existe sinistro(s) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(sinisters.items);

    return {
      total: sinisters.total,
      items,
    };
  }

  private toDTO(drivers: Sinister[]): MappedSinisterDTO[] {
    return drivers.map((sinister) => {
      return {
        id: sinister.id,
        type: sinister.type,
        description: sinister.description,
        createdAt: sinister.createdAt,
      };
    });
  }
}
