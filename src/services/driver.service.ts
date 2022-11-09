import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Driver } from "../entities/driver.entity";
import IDriverRepository from "../repositories/driver/driver.repository.contract";
import { Page, PageResponse } from "../configs/database/page.model";
import { FiltersDriverDTO } from "../dtos/driver/filtersDriver.dto";
import { MappedDriverDTO } from "../dtos/driver/mappedDriver.dto";
import { CreateDriverDTO } from "../dtos/driver/createDriver.dto";
import { UpdateDriverDTO } from "../dtos/driver/updateDriver.dto";

@Injectable()
export class DriverService {
  constructor(
    @Inject("IDriverRepository")
    private readonly driverRepository: IDriverRepository
  ) { }

  async create(payload: CreateDriverDTO): Promise<Driver> {
    return await this.driverRepository.create(new Driver(payload));
  }

  async delete(id: string): Promise<Driver> {
    const driver = await this.listById(id);

    return await this.driverRepository.delete(driver.id);
  }

  async listById(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);

    if (!driver) throw new HttpException(`Não foi encontrado um driver com o id: ${id}`, HttpStatus.NOT_FOUND);

    return driver;
  }

  async listAll(page: Page, filters?: FiltersDriverDTO): Promise<PageResponse<MappedDriverDTO>> {

    const drivers = await this.driverRepository.findAll(page, filters);

    if (drivers.total === 0) {
      throw new HttpException("Não existe drivers para esta pesquisa!", HttpStatus.NOT_FOUND);
    }

    const items = this.toDTO(drivers.items);

    return {
      total: drivers.total,
      items
    }
  }

  async update(id: string, data: UpdateDriverDTO): Promise<Driver> {

    const driver = await this.listById(id);

    return await this.driverRepository.update(Object.assign(driver, {...driver, ...data}));
  }

  private toDTO(drivers: Driver[]): MappedDriverDTO[] {
    return drivers.map(driver => {
      return {
        id: driver.id,
        category: driver.category,
        cnh: driver.cnh,
        cpf: driver.cpf,
        name: driver.name,
        validation: driver.validation,
        createdAt: driver.createdAt
      }
    })
  }
}
