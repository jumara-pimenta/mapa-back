import { Page, PageResponse } from 'src/configs/database/page.model';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
  BackOfficeUserUpdateDTO,
} from 'src/dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from 'src/entities/backOfficeUser.entity';

export default interface IBackOfficeUserRepository {
  create(data: BackOfficeUser): Promise<BackOfficeUser>;
  getByEmail(email: string): Promise<BackOfficeUser>;
  findById(id: string): Promise<BackOfficeUser>;
  delete(id: string): Promise<BackOfficeUser>;
  findAll(page: Page, filters?: any): Promise<PageResponse<BackOfficeUser>>;
  update(id: string, data: BackOfficeUserUpdateDTO): Promise<BackOfficeUser>;
}
