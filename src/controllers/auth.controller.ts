import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Page } from '../configs/database/page.model';
import { Roles } from '../decorators/roles.decorator';
import {
  BackOfficeUserCreateDTO,
  BackOfficeUserDTO,
  BackOfficeUserUpdateDTO,
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
import { UpdateBackofficeUserPasswordDTO } from '../dtos/backofficeUser/updateBackofficeUserPassword.dto';
import { MappedBackOfficeUserDTO } from '../dtos/auth/mappedBackOfficeUser.dto';
import { BackofficeUserService } from '../services/backOfficeUser.service';

@Controller('/api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly backofficeUserService: BackofficeUserService,
  ) {}

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

  @Get('/backoffice')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async backofficeAuthGet(
    @Query() page: Page,
    @Query() filters: any,
  ): Promise<any> {
    return await this.authService.listBackOfficeUsers(page, filters);
  }

  @Put('/backoffice/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async backofficeAuthUpdate(
    @Param('id') id: string,
    @Body() payload: BackOfficeUserUpdateDTO,
    @Headers('authorization') token?: string,
  ): Promise<any> {
    return await this.authService.updateBackOfficeUser(id, payload, token);
  }

  @Delete('/backoffice/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async backofficeAuthDelete(@Param('id') id: string): Promise<any> {
    return await this.authService.deleteBackOfficeUser(id);
  }

  @Patch('/backoffice/resetPassword')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async updateBackofficeUserPassword(
    @Body() payload: UpdateBackofficeUserPasswordDTO,
  ): Promise<MappedBackOfficeUserDTO> {
    return await this.backofficeUserService.updatePassword(payload);
  }
}
