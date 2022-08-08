import { Controller, Get } from '@nestjs/common';

interface FeatureDto {
  name: string;
  pretty_name: string;
  description: string;
}

@Controller()
export class AppController {
  @Get('/feature')
  feature(): Array<FeatureDto> {
    return [
      {
        name: 'SONARACCESS',
        pretty_name: 'Permissão de Acesso',
        description: 'O usuario pode acessar o módulo Sonar',
      },
    ];
  }
}
