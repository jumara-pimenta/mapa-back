import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ICoreServiceIntegration from '../integrations/services/coreService/core.service.integration.contract';
import { differenceInSeconds, fromUnixTime, isAfter } from 'date-fns';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
} from 'src/dtos/auth/backOfficeUserLogin.dto';
import IBackOfficeUserRepository from 'src/repositories/backOfficeUser/backOffice.repository.contract';
import * as bcrypt from 'bcrypt';
import { BackOfficeUser } from 'src/entities/backOfficeUser.entity';
import { setPermissions } from 'src/utils/roles.permissions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ICoreServiceIntegration')
    private readonly coreServiceIntegration: ICoreServiceIntegration,
    @Inject('IBackOfficeUserRepository')
    private readonly backOfficeUserRepository: IBackOfficeUserRepository,
  ) {}
  

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
        expiresIn: '7d',
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      },
    );

    return token;
  }

  async generateTokenData(data: any) {
    return this.generateToken(0, data);
  }

  private getRemainingTokenTime(expireToken: number): number {
    return differenceInSeconds(fromUnixTime(expireToken), new Date());
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
      role: user.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt, createdAt, password, ...result } = user;

    return { ...result, token };
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
}
