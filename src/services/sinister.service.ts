import { Sinister } from 'src/entities/sinister.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSinisterDTO } from 'src/dtos/sinister/createSinister.dto';
import { UpdateSinisterDTO } from 'src/dtos/sinister/updateSinister.dto';
import ISinisterRepository from 'src/repositories/sinister/sinister.repository.contract';

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
}
