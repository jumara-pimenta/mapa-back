import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ICoreServiceIntegration from '../integrations/services/coreService/core.service.integration.contract';
import { differenceInSeconds, fromUnixTime } from 'date-fns';
import { BackOfficeUserCreateDTO, BackOfficeUserDTO } from 'src/dtos/auth/backOfficeUserLogin.dto';
import IBackOfficeUserRepository from 'src/repositories/backOfficeUser/backOffice.repository.contract';
import * as bcrypt from 'bcrypt';
import { BackOfficeUser } from 'src/entities/backOfficeUser.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ICoreServiceIntegration')
    private readonly coreServiceIntegration: ICoreServiceIntegration,
    @Inject('IBackOfficeUserRepository')
    private readonly backOfficeUserRepository: IBackOfficeUserRepository,
  ) {}
  

  async authenticate(token: string): Promise<boolean> {
    const tokenExtracted = this.extractToken(token);

    if (!tokenExtracted)
      throw new HttpException('Token não provido', HttpStatus.UNAUTHORIZED);

    // const decodedToken = await this.jwtService.verify(tokenExtracted, { secret: process.env.SECRET_KEY_ACCESS_TOKEN });

    // const tokenExpirationIsAfterNow = isAfter(fromUnixTime(decodedToken.exp), new Date())

    // if(!tokenExpirationIsAfterNow) throw new HttpException("Token está expirado", HttpStatus.UNAUTHORIZED);

    return;
  }

  async login(_token: string): Promise<any> {
    const _tokenExtracted = this.extractToken(_token);

    if (!_tokenExtracted)
      throw new HttpException(
        'token não providenciado',
        HttpStatus.UNAUTHORIZED,
      );

    const _decodedToken = await this.coreServiceIntegration
      .verifyToken(_tokenExtracted)
      .catch(async (e) => {
        throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
      });

    // const employee = await this.employeeService.getByCode(_decodedToken.employee_code);

    // const token = this.generateToken(_decodedToken.exp, employee);

    // return { token };
  }

  private generateToken(_expireToken: number, employee: any) {
    const remainingToExpire = this.getRemainingTokenTime(_expireToken);

    // const token = this.jwtService.sign(
    //     { sub: employee },
    //     { expiresIn: `${remainingToExpire}s` }
    // );

    // return token;
  }

  private getRemainingTokenTime(expireToken: number): number {
    return differenceInSeconds(fromUnixTime(expireToken), new Date());
  }

  private extractToken(tokenToExtract: string): string {
    const [, token] = tokenToExtract.split('Bearer ');
    return token;
  }

  async backofficeLogin(data: BackOfficeUserDTO): Promise<any> {
    // const { email, password } = data;
    data.password
    // await this.backOfficeUserRepository.create(data);
  

    // const token = await this.coreServiceIntegration
    //   .login(email, password)
    //   .catch(async (e) => {
    //     throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
    //   });

    // return { token };

    // const decodedToken = await this.jwtService.verify(token, { secret: process.env.SECRET_KEY_ACCESS_TOKEN });
  }

  async backofficeUserCreate(data: BackOfficeUserCreateDTO): Promise<any> {
    data.password = bcrypt.hashSync(data.password, 10);

    return await this.backOfficeUserRepository.create(new BackOfficeUser(data));

    
  }
}
