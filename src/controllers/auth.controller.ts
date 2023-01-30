import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
} from '../dtos/auth/backOfficeUserLogin.dto';
import { CoreTokenDTO } from '../dtos/auth/CoreToken.dto';
import { signInDriverDTO } from '../dtos/driver/signInDriver.dto';
import { SignInEmployeeDTO } from '../dtos/employee/signInEmployee.dto';
import {
  BackOfficeUserCreate,
  BackOfficeUserLogin,
  DriverLogin,
  EmployeeLogin,
} from '../utils/examples.swagger';
import { Public } from '../decorators/public.decorator';
import { TokenDTO } from '../dtos/auth/token.dto';
import { AuthService } from '../services/auth.service';

@Controller('/api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/backoffice/signin')
  @Public()
  @ApiCreatedResponse({
    description: 'Login for BackOfficeUser.',
    schema: {
      type: 'object',
      example: BackOfficeUserLogin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async backofficeAuth(@Body() payload: BackOfficeUserDTO): Promise<TokenDTO> {
    return await this.authService.backofficeLogin(payload);
  }

  @Post('/backoffice/signup')
  @Roles('ADMIN')
  @ApiCreatedResponse({
    description: 'Create BackOfficeUser.',
    schema: {
      type: 'object',
      example: BackOfficeUserCreate,
    },
  })
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
  @ApiCreatedResponse({
    description: 'Login for Employee.',
    schema: {
      type: 'object',
      example: EmployeeLogin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async employeeAuth(@Body() payload: SignInEmployeeDTO): Promise<any> {
    return await this.authService.employeeLogin(payload);
  }

  @Post('/driver/signin')
  @Public()
  @ApiCreatedResponse({
    description: 'Login for drivers.',
    schema: {
      type: 'object',
      example: DriverLogin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async driverAuth(@Body() payload: signInDriverDTO): Promise<any> {
    return await this.authService.driverLogin(payload);
  }
}
