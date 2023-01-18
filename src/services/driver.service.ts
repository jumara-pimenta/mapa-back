import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import IDriverRepository from '../repositories/driver/driver.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersDriverDTO } from '../dtos/driver/filtersDriver.dto';
import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
import { CreateDriverDTO } from '../dtos/driver/createDriver.dto';
import { UpdateDriverDTO } from '../dtos/driver/updateDriver.dto';

@Injectable()
export class DriverService {
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async create(payload: CreateDriverDTO): Promise<Driver> {
    const cpfAlredyExist = await this.driverRepository.findByCpf(payload.cpf);
    const cnhAlredyExist = await this.driverRepository.findByCnh(payload.cnh);

    function isValidCPF(cpf) {
      if (typeof cpf !== 'string') return false;
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
      cpf = cpf.split('').map((el) => +el);
      const rest = (count) =>
        ((cpf
          .slice(0, count - 12)
          .reduce((soma, el, index) => soma + el * (count - index), 0) *
          10) %
          11) %
        10;
      return rest(10) === cpf[9] && rest(11) === cpf[10];
    }

    if (
      payload.cpf.length !== 11 ||
      (!Array.from(payload.cpf).filter((e) => e !== payload.cpf[0]).length &&
        isValidCPF)
    ) {
      throw new HttpException(
        `CPF INVALIDO: ${payload.cpf}`,
        HttpStatus.CONFLICT,
      );
    }
    if (cpfAlredyExist) {
      throw new HttpException(
        `CPF ja cadastrado: ${payload.cpf}`,
        HttpStatus.CONFLICT,
      );
    }
    if (cnhAlredyExist) {
      throw new HttpException(
        `CNH ja cadastrado: ${payload.cnh}`,
        HttpStatus.CONFLICT,
      );
    } else {
      return await this.driverRepository.create(new Driver(payload));
    }
  }

  async delete(id: string): Promise<Driver> {
    const driver = await this.listById(id);

    return await this.driverRepository.delete(driver.id);
  }

  async listById(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);

    if (!driver)
      throw new HttpException(
        `Não foi encontrado um driver com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return driver;
  }

  async listAll(
    page: Page,
    filters?: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
    const drivers = await this.driverRepository.findAll(page, filters);

    if (drivers.total === 0) {
      throw new HttpException(
        'Não existe motorista(s) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(drivers.items);

    return {
      total: drivers.total,
      items,
    };
  }

  async update(id: string, data: UpdateDriverDTO): Promise<Driver> {
    const driver = await this.listById(id);

    if (data.cpf) {
      const cpfAlredyExist = await this.driverRepository.findByCpf(data.cpf);

      if (cpfAlredyExist && cpfAlredyExist.cpf !== driver.cpf) {
        throw new HttpException(
          `CPF ja cadastrado: ${data.cpf}`,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.cnh) {
      const cnhAlredyExist = await this.driverRepository.findByCnh(data.cnh);

      if (cnhAlredyExist && cnhAlredyExist.cnh !== driver.cnh) {
        throw new HttpException(
          `CNH ja cadastrado: ${data.cnh}`,
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.driverRepository.update(
      Object.assign(driver, { ...driver, ...data }),
    );
  }

  private toDTO(drivers: Driver[]): MappedDriverDTO[] {
    return drivers.map((driver) => {
      return {
        id: driver.id,
        category: driver.category,
        cnh: driver.cnh,
        cpf: driver.cpf,
        name: driver.name,
        validation: driver.validation,
        createdAt: driver.createdAt,
      };
    });
  }
}
