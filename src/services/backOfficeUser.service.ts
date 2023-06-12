import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
} from '../dtos/auth/backOfficeUserLogin.dto';
import { BackOfficeUser } from '../entities/backOfficeUser.entity';
import IBackOfficeUserRepository from '../repositories/backOfficeUser/backOffice.repository.contract';
import * as bcrypt from 'bcrypt';
import { MappedBackOfficeUserDTO } from '../dtos/auth/mappedBackOfficeUser.dto';
import { UpdateBackofficeUserPasswordDTO } from '../dtos/backofficeUser/updateBackofficeUserPassword.dto';
import { AuthService } from './auth.service';
import { EMAIL_ADM_ROTAS } from 'src/utils/Constants';

@Injectable()
export class BackofficeUserService {
  constructor(
    @Inject('IBackOfficeUserRepository')
    private readonly backOfficeUserRepository: IBackOfficeUserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async listByEmail(email: string): Promise<BackOfficeUser> {
    const user = await this.backOfficeUserRepository.getByEmail(email);

    if (!user)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    return user;
  }

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

  async updatePassword(
    payload: UpdateBackofficeUserPasswordDTO,
  ): Promise<MappedBackOfficeUserDTO> {
    const { email, newPassword } = payload;

    const user = await this.listByEmail(email);

    if (email === EMAIL_ADM_ROTAS) {
      throw new HttpException(
        'Não é possível alterar a senha do administrador do sistema. Consulte a administração!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordIsTheSameAsAbove = bcrypt.compareSync(
      newPassword,
      user.password,
    );

    if (passwordIsTheSameAsAbove)
      throw new HttpException(
        'A senha deve ser diferente da senha atual!',
        HttpStatus.CONFLICT,
      );

    user.password = bcrypt.hashSync(newPassword, 10);

    const updatedUser = await this.backOfficeUserRepository.updatePassword(
      user.id,
      user.password,
    );

    return this.mapperOne(updatedUser);
  }

  private mapperOne(data: BackOfficeUser): MappedBackOfficeUserDTO {
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      roleType: data.roleType,
      createdAt: data.createdAt,
    };
  }
}
