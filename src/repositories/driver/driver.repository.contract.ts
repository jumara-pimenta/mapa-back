import { FiltersDriverDTO } from '../../dtos/driver/filtersDriver.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Driver } from '../../entities/driver.entity';

export default interface IDriverRepository {
  create(data: Driver): Promise<Driver>;
  delete(id: string): Promise<Driver>;
  findAll(
    page: Page,
    filters?: FiltersDriverDTO,
  ): Promise<PageResponse<Driver>>;
  findById(id: string): Promise<Driver>;
  findByCpf(cpf: string): Promise<Driver>;
  findByCnh(cnh: string): Promise<Driver>;
  update(data: Driver): Promise<Driver>;
}
