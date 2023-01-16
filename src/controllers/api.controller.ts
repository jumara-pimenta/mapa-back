import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Api')
export class ApiController {
  @Get('/feature')
  @HttpCode(HttpStatus.OK)
  async feature() {
    return [
      {
        name: 'BOILERPLATE-BACKEND-ACCESS',
        pretty_name: 'Permissão de Acesso',
        description: 'O usuario pode acessar o módulo BOILERPLATE-BACKEND',
      },
    ];
  }
}
