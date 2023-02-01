import { Page, PageResponse } from '../../configs/database/page.model';
import { FiltersSinisterDTO } from '../../dtos/sinister/filtersSinister.dto';
import { Sinister } from '../../entities/sinister.entity';

export default interface ISinisterRepository {
  create(data: Sinister): Promise<Sinister>;
  update(data: Sinister): Promise<Sinister>;
  findById(id: string): Promise<Sinister>;
  findAll(
    page: Page,
    filters?: FiltersSinisterDTO,
  ): Promise<PageResponse<Sinister>>;
}
