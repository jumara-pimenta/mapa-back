import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ICoreServiceIntegration from '../integrations/services/coreService/core.service.integration.contract';
import { differenceInSeconds, fromUnixTime, isAfter } from 'date-fns';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
  BackOfficeUserUpdateDTO,
} from '../dtos/auth/backOfficeUserLogin.dto';
import IBackOfficeUserRepository from '../repositories/backOfficeUser/backOffice.repository.contract';
import * as bcrypt from 'bcrypt';
import { BackOfficeUser } from '../entities/backOfficeUser.entity';
import { setPermissions } from '../utils/roles.permissions';
import { CoreTokenDTO } from '../dtos/auth/CoreToken.dto';
import { ERoles } from '../utils/ETypes';
import { EmployeeService } from './employee.service';
import { SignInEmployeeDTO } from '../dtos/employee/signInEmployee.dto';
import { DriverService } from './driver.service';
import { signInDriverDTO } from '../dtos/driver/signInDriver.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { FilterBackOfficeUserDTO } from '../dtos/auth/filterBackOfficeUser.dto';
import { MappedBackOfficeUserDTO } from '../dtos/auth/mappedBackOfficeUser.dto';
import { SigninBackOfficeDTO } from '../dtos/auth/signinBackoffice.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ICoreServiceIntegration')
    private readonly coreServiceIntegration: ICoreServiceIntegration,
    @Inject('IBackOfficeUserRepository')
    private readonly backOfficeUserRepository: IBackOfficeUserRepository,
    private readonly employeeService: EmployeeService,
    private readonly driverService: DriverService,
  ) {}

  async backofficeCore(payload: CoreTokenDTO): Promise<any> {
    const token = await this.coreServiceIntegration.verifyToken(payload.token);

    const exp = differenceInSeconds(fromUnixTime(token.exp), new Date());

    return {
      token: await this.jwtService.signAsync(
        { sub: token, permissions: setPermissions(ERoles.ROLE_ADMIN) },
        {
          expiresIn: exp,
          secret: process.env.SECRET_KEY_ACCESS_TOKEN,
        },
      ),
    };
  }

  private verifyToken(token: string): any {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      });

      return decodedToken;
    } catch (e) {
      throw new HttpException('Token inválido!', HttpStatus.UNAUTHORIZED);
    }
  }

  async authenticate(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token não provido!', HttpStatus.UNAUTHORIZED);
    const tokenExtracted = this.extractToken(token);

    const decodedToken = this.verifyToken(tokenExtracted);

    const tokenExpirationIsAfterNow = isAfter(
      fromUnixTime(decodedToken.exp),
      new Date(),
    );

    if (!tokenExpirationIsAfterNow)
      throw new HttpException('Token está expirado', HttpStatus.UNAUTHORIZED);

    return;
  }

  private generateToken(_expireToken: number, employee: any) {
    const token = this.jwtService.sign(
      { sub: employee, permissions: setPermissions(employee.role) },
      {
        expiresIn: '1d',
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      },
    );

    return token;
  }

  async generateTokenData(data: any) {
    return this.generateToken(0, data);
  }

  private extractToken(tokenToExtract: string): string {
    const [, token] = tokenToExtract.split('Bearer ');
    return token;
  }

  async backofficeLogin(data: BackOfficeUserDTO): Promise<any> {
    const user = await this.backOfficeUserRepository.getByEmail(data.email);

    if (!user)
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );

    const isValidPassword = bcrypt.compareSync(data.password, user.password);

    if (!isValidPassword)
      throw new HttpException(
        'E-mail ou senha inválido',
        HttpStatus.UNAUTHORIZED,
      );

    const token = this.generateToken(1 * 1000 * 60 * 60, {
      id: user.id,
      name: user.name,
      role: user.roleType,
    });

    return this.mapperOne(user, token);
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

  async decodeJWT(token: string): Promise<any> {
    const tokenExtracted = this.extractToken(token);

    if (!tokenExtracted)
      throw new HttpException('Token não provido', HttpStatus.UNAUTHORIZED);

    const decodedToken = await this.jwtService.decode(tokenExtracted);

    return decodedToken;
  }

  async employeeLogin(data: SignInEmployeeDTO): Promise<any> {
    const employee = await this.employeeService.findByRegistration(data.login);

    if (!employee)
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );

    const isValidPassword = bcrypt.compareSync(
      data.password,
      employee.password,
    );

    if (!isValidPassword)
      throw new HttpException(
        'E-mail ou senha inválido',
        HttpStatus.UNAUTHORIZED,
      );

    const token = this.jwtService.sign(
      {
        sub: {
          id: employee.id,
          name: employee.name,
          role: ERoles.ROLE_EMPLOYEE,
        },
        permissions: setPermissions(ERoles.ROLE_EMPLOYEE),
      },
      {
        expiresIn: '7d',
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt, deletedAt, createdAt, password, ...result } = employee;

    result.address = JSON.parse(result.address);

    return { ...result, token };
  }

  async driverLogin(data: signInDriverDTO): Promise<any> {
    const driver = await this.driverService.getByCpf(data.login);

    if (!driver)
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );

    const isValidPassword = bcrypt.compareSync(data.password, driver.password);

    if (!isValidPassword)
      throw new HttpException(
        'E-mail ou senha inválido',
        HttpStatus.UNAUTHORIZED,
      );

    const token = this.jwtService.sign(
      {
        sub: {
          id: driver.id,
          name: driver.name,
          role: ERoles.ROLE_DRIVER,
        },
        permissions: setPermissions(ERoles.ROLE_DRIVER),
      },
      {
        expiresIn: '7d',
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt, createdAt, password, ...result } = driver;

    return { ...result, token };
  }

  async listBackOfficeUsers(
    page: Page,
    filters?: FilterBackOfficeUserDTO,
  ): Promise<PageResponse<MappedBackOfficeUserDTO>> {
    const users = await this.backOfficeUserRepository.findAll(page, filters);

    if (users.total === 0)
      throw new HttpException(
        {
          message: 'Nenhum usuário encontrado',
          status: HttpStatus.NO_CONTENT,
        },
        HttpStatus.NOT_FOUND,
      );

    const items = this.mapperMany(users.items);

    return { total: users.total, items };
  }

  async updateBackOfficeUser(
    id: string,
    data: BackOfficeUserUpdateDTO,
    token?: string,
  ): Promise<MappedBackOfficeUserDTO> {
    const user = await this.backOfficeUserRepository.findById(id);

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (data?.password) {
      if (!token)
        throw new HttpException('Token não provido', HttpStatus.UNAUTHORIZED);
      const admin = await this.decodeJWT(token);
      if (admin.sub.name !== 'Admin')
        throw new HttpException(
          'Você não tem permissão para alterar a senha',
          HttpStatus.UNAUTHORIZED,
        );
      data.password = bcrypt.hashSync(data.password, 10);
    }

    const updatedUser = await this.backOfficeUserRepository.update(id, data);

    return this.mapper(updatedUser);
  }

  async deleteBackOfficeUser(id: string): Promise<MappedBackOfficeUserDTO> {
    const user = await this.backOfficeUserRepository.findById(id);

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const deletedUser = await this.backOfficeUserRepository.delete(id);

    return this.mapper(deletedUser);
  }

  private mapperMany(
    BackOfficeUsers: BackOfficeUser[],
  ): MappedBackOfficeUserDTO[] {
    return BackOfficeUsers.map((BackOfficeUser) => this.mapper(BackOfficeUser));
  }

  private mapper(BackOfficeUser: BackOfficeUser): MappedBackOfficeUserDTO {
    const { ...result } = BackOfficeUser;

    return result;
  }

  private mapperOne(user: BackOfficeUser, token: string): SigninBackOfficeDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleType: user.roleType,
      createdAt: user.createdAt,
      token,
    };
  }
}
