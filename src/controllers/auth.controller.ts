import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
} from 'src/dtos/auth/backOfficeUserLogin.dto';
import { CoreTokenDTO } from 'src/dtos/auth/CoreToken.dto';
import { signInDriverDTO } from 'src/dtos/driver/signInDriver.dto';
import { SignInEmployeeDTO } from 'src/dtos/employee/signInEmployee.dto';
import { Public } from '../decorators/public.decorator';
import { TokenDTO } from '../dtos/auth/token.dto';
import { AuthService } from '../services/auth.service';

@Controller('/api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/backoffice/signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  async backofficeAuth(@Body() payload: BackOfficeUserDTO): Promise<TokenDTO> {
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

  @Post('/backoffice/core')
  @Public()
  @HttpCode(HttpStatus.OK)
  async backofficeAuthCore(@Body() token: CoreTokenDTO): Promise<any> {
    return await this.authService.backofficeCore(token);
  }

  @Post('/employee/signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  async employeeAuth(@Body() payload: SignInEmployeeDTO): Promise<any> {
    return await this.authService.employeeLogin(payload);
  }

  @Post('/driver/signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  async driverAuth(@Body() payload: signInDriverDTO): Promise<any> {
    return await this.authService.driverLogin(payload);
  }
}
