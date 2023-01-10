import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BackOfficeUserCreateDTO, BackOfficeUserDTO } from 'src/dtos/auth/backOfficeUserLogin.dto';
import { Public } from '../decorators/public.decorator';
import { HeaderDTO } from '../dtos/auth/header.dto';
import { TokenDTO } from '../dtos/auth/token.dto';
import { AuthService } from '../services/auth.service';

@Controller('/api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async auth(@Headers() headers: HeaderDTO): Promise<TokenDTO> {
    return await this.authService.login(headers.authorization);
  }

  @Post('/backoffice/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async backofficeAuth(
    @Headers() headers: HeaderDTO,
    @Body() payload: BackOfficeUserDTO,
  ): Promise<TokenDTO> {
    return await this.authService.backofficeLogin(payload);
  }

  @Post('/backoffice/signup')
  @Public()
  @HttpCode(HttpStatus.OK)
  async backofficeAuthSignUp(
    @Body() payload: BackOfficeUserCreateDTO,
  ): Promise<any> {
    return await this.authService.backofficeUserCreate(payload);
  }
}
