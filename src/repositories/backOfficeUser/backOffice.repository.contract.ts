import { Page, PageResponse } from '../../configs/database/page.model';
import { BackOfficeUserUpdateDTO } from '../../dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from '../../entities/backOfficeUser.entity';

export default interface IBackOfficeUserRepository {
  create(data: BackOfficeUser): Promise<BackOfficeUser>;
  getByEmail(email: string): Promise<BackOfficeUser>;
  findById(id: string): Promise<BackOfficeUser>;
  delete(id: string): Promise<BackOfficeUser>;
  findAll(page: Page, filters?: any): Promise<PageResponse<BackOfficeUser>>;
  update(id: string, data: BackOfficeUserUpdateDTO): Promise<BackOfficeUser>;
}
