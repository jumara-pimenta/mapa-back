import { Page, PageResponse } from 'src/configs/database/page.model';
import { FiltersSinisterDTO } from 'src/dtos/sinister/filtersSinister.dto';
import { Sinister } from 'src/entities/sinister.entity';

export default interface ISinisterRepository {
  create(data: Sinister): Promise<Sinister>;
  update(data: Sinister): Promise<Sinister>;
  findById(id: string): Promise<Sinister>;
  findAll(
    page: Page,
    filters?: FiltersSinisterDTO,
  ): Promise<PageResponse<Sinister>>;
  vinculatePath(sinister: Sinister[], pathId: string): Promise<Sinister[]>;
}
