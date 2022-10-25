import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import ICoreServiceIntegration from "../integrations/services/coreService/core.service.integration.contract";
import { differenceInSeconds, fromUnixTime, isAfter } from "date-fns";
import { TokenDTO } from "../dtos/auth/token.dto";

@Injectable()
export class AuthService {
  constructor(
    // private readonly jwtService: JwtService,
    @Inject("ICoreServiceIntegration")
    private readonly coreServiceIntegration: ICoreServiceIntegration
  ) {}

  async authenticate(token: string): Promise<boolean> {
    const tokenExtracted = this.extractToken(token);

    if (!tokenExtracted) throw new HttpException("Token não provido", HttpStatus.UNAUTHORIZED);

    // const decodedToken = await this.jwtService.verify(tokenExtracted, { secret: process.env.SECRET_KEY_ACCESS_TOKEN });

    // const tokenExpirationIsAfterNow = isAfter(fromUnixTime(decodedToken.exp), new Date())

    // if(!tokenExpirationIsAfterNow) throw new HttpException("Token está expirado", HttpStatus.UNAUTHORIZED);

    return
  }

  async login(_token: string): Promise<any> {
    const _tokenExtracted = this.extractToken(_token);

    if (!_tokenExtracted) throw new HttpException("token não providenciado", HttpStatus.UNAUTHORIZED);

    const _decodedToken = await this.coreServiceIntegration.verifyToken(_tokenExtracted)
      .catch(async e => {
        throw new HttpException("Não autorizado", HttpStatus.UNAUTHORIZED);
      })

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
    const [, token] = tokenToExtract.split("Bearer ");
    return token;
  }
}
