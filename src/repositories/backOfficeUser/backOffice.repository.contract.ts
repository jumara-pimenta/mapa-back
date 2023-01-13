import { Page, PageResponse } from 'src/configs/database/page.model';
import { BackOfficeUserCreateDTO, BackOfficeUserDTO } from 'src/dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from 'src/entities/backOfficeUser.entity';

export default interface IBackOfficeUserRepository {
  create(data: BackOfficeUser): Promise<BackOfficeUser>;
  getByEmail(email: string): Promise<BackOfficeUser>;
  delete(id: string): Promise<BackOfficeUser>;
  // findAll(
  //   page: Page,
  // ): Promise<PageResponse<BackOfficeUser>>;
  update(data: BackOfficeUser): Promise<BackOfficeUser>;
}
