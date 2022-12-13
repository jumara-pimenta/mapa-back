import { FiltersPinDTO } from '../../dtos/pin/filtersPin.dto';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pin } from '../../entities/pin.entity';

export default interface IPinRepository {
  findAll(page: Page, filters?: FiltersPinDTO): Promise<PageResponse<Pin>>;
  create(data: Pin): Promise<Pin>;
  delete(id: string): Promise<Pin>;
  findById(id: string): Promise<Pin>;
  update(data: Pin): Promise<Pin>;
}
