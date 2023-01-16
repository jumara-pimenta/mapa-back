import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
