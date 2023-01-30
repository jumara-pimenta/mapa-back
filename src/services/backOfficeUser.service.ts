import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
} from '../dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from '../entities/backOfficeUser.entity';
import IBackOfficeUserRepository from '../repositories/backOfficeUser/backOffice.repository.contract';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IBackOfficeUserRepository')
    private readonly backOfficeUserRepository: IBackOfficeUserRepository,
    private readonly authService: AuthService,
  ) {}

  async backofficeLogin(data: BackOfficeUserDTO): Promise<any> {
    return await this.authService.backofficeLogin(data);
  }

  async backofficeUserCreate(data: BackOfficeUserCreateDTO): Promise<any> {
    const userExists = await this.backOfficeUserRepository.getByEmail(
      data.email,
    );

    if (userExists)
      throw new HttpException('Usuário já existe', HttpStatus.UNAUTHORIZED);
    data.password = bcrypt.hashSync(data.password, 10);

    const user = await this.backOfficeUserRepository.create(
      new BackOfficeUser(data),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }
}
