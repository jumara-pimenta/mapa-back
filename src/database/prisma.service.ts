import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    const backOfficeUser = await this.backOfficeUser.findFirst({
      where: {
        email: 'admin@rotas.com.br',
      },
    });

    if (!backOfficeUser) {
      await this.backOfficeUser.upsert({
        where: {
          email: 'admin@rotas.com.br',
        },
        create: {
          id: uuid(),
          email: 'admin@rotas.com.br',
          password: await bcrypt.hash('Denso', 10),
          name: 'Admin',
          role: 'ADMIN',
          createdAt: new Date(),
        },
        update: {
          email: 'admin@rotas.com.br',
          password: await bcrypt.hash('Denso', 10),
          name: 'Admin',
          role: 'ADMIN',
        },
      });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
