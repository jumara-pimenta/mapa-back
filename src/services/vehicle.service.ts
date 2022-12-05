import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import IVehicleRepository from '../repositories/vehicle/vehicle.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersVehicleDTO } from '../dtos/vehicle/filtersVehicle.dto';
import { MappedVehicleDTO } from '../dtos/vehicle/mappedVehicle.dto';
import { CreateVehicleDTO } from '../dtos/vehicle/createVehicle.dto';
import { UpdateVehicleDTO } from '../dtos/vehicle/updateVehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject('IVehicleRepository')
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async create(payload: CreateVehicleDTO): Promise<Vehicle> {
    const plateExists = await this.vehicleRepository.findByPlate(payload.plate);
    const renavamExists = await this.vehicleRepository.findByRenavam(
      payload.renavam,
    );

    if (plateExists)
      throw new HttpException(
        'Placa cadastrada para outro veículo',
        HttpStatus.CONFLICT,
      );

    if (renavamExists)
      throw new HttpException(
        'Renavam cadastrado para outro veículo',
        HttpStatus.CONFLICT,
      );

    return await this.vehicleRepository.create(
      new Vehicle({
        ...payload,
        expiration: new Date(payload.expiration),
        lastMaintenance: new Date(payload.lastMaintenance),
        lastSurvey: new Date(payload.lastSurvey),
      }),
    );
  }

  async delete(id: string): Promise<Vehicle> {
    const vehicle = await this.listById(id);

    return await this.vehicleRepository.delete(vehicle.id);
  }

  async listById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle)
      throw new HttpException(
        `Não foi encontrado um veículo com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return vehicle;
  }

  async listAll(
    page: Page,
    filters?: FiltersVehicleDTO,
  ): Promise<PageResponse<MappedVehicleDTO>> {
    const vehicles = await this.vehicleRepository.findAll(page, filters);

    if (vehicles.total === 0) {
      throw new HttpException(
        'Não existe veículo para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(vehicles.items);

    return {
      total: vehicles.total,
      items,
    };
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.listById(id);

    if (data.plate) {
      const plateExists = await this.vehicleRepository.findByPlate(data.plate);

      if (plateExists && plateExists.plate !== vehicle.plate) {
        throw new HttpException(
          'Placa cadastrada para outro veículo',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.renavam) {
      const renavamExists = await this.vehicleRepository.findByRenavam(
        data.renavam,
      );

      if (renavamExists && renavamExists.renavam !== vehicle.renavam) {
        if (renavamExists.id !== id) {
          throw new HttpException(
            'Renavam cadastrado para outro veículo',
            HttpStatus.CONFLICT,
          );
        }
      }
    }

    return await this.vehicleRepository.update(
      Object.assign(vehicle, { ...vehicle, ...data }),
    );
  }

  private toDTO(vehicles: Vehicle[]): MappedVehicleDTO[] {
    return vehicles.map((vehicle) => {
      return {
        id: vehicle.id,
        capacity: vehicle.capacity,
        company: vehicle.company,
        expiration: vehicle.expiration,
        isAccessibility: vehicle.isAccessibility,
        lastMaintenance: vehicle.lastMaintenance,
        lastSurvey: vehicle.lastSurvey,
        note: vehicle.note,
        plate: vehicle.plate,
        renavam: vehicle.renavam,
        type: vehicle.type,
        createdAt: vehicle.createdAt,
      };
    });
  }
}
