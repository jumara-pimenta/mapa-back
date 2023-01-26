import { BackOfficeUser } from '../../entities/backOfficeUser.entity';

export default interface IBackOfficeUserRepository {
  create(data: BackOfficeUser): Promise<BackOfficeUser>;
  getByEmail(email: string): Promise<BackOfficeUser>;
  delete(id: string): Promise<BackOfficeUser>;
  update(data: BackOfficeUser): Promise<BackOfficeUser>;
}
