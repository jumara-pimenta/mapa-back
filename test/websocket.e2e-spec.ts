import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/modules/app.module';
import { WebsocketGateway } from '../src/gateway/websocket.gateway';
import { WsException } from '@nestjs/websockets';

describe('WebSocket Test', () => {
  let app: INestApplication;
  let gateway: WebsocketGateway;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    app.listen(3051);
    gateway = app.get(WebsocketGateway);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should connect to WebSocket server', async () => {
    try {
      const result = await gateway.handleRouteStart({
        pathId: '1234',
      });

      console.log('log do resultado:', result);
      
    } catch (error) {
      // Verifique se a exceção é uma instância de WsException
      expect(error).toBeInstanceOf(WsException);
      // Verifique o conteúdo da mensagem de erro
      expect(error.message).toBe('Não foi encontrado trajeto com o id: 1234!');
    }
  });
});
