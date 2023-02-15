import { Page, PageResponse } from 'src/configs/database/page.model';
import { FiltersSinisterDTO } from 'src/dtos/sinister/filtersSinister.dto';
import { Path } from 'src/entities/path.entity';
import { Sinister } from 'src/entities/sinister.entity';

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
    pathId: Path,
  ): Promise<Sinister[]>;
}
