import { Global, Module } from "@nestjs/common";
import { PrismaService } from "../configs/database/prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})

export class RepositoryModule { }
