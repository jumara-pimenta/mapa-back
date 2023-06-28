import { Page, PageResponse } from '../../configs/database/page.model';
import { FiltersSinisterDTO } from '../../dtos/sinister/filtersSinister.dto';
import { Path } from '../../entities/path.entity';
import { Sinister } from '../../entities/sinister.entity';

export default interface ISinisterRepository {
  create(data: Sinister): Promise<Sinister>;
  update(data: Sinister): Promise<Sinister>;
  findById(id: string): Promise<Sinister>;
  listByPathId(id: string): Promise<Sinister[]>;
  findAll(
    page: Page,
    filters?: FiltersSinisterDTO,
  ): Promise<PageResponse<Sinister>>;
  vinculatePath(
    sinister: Sinister,
    routeHistoryId: string,
    pathId: Partial<Path>,
  ): Promise<Sinister[]>;
}
