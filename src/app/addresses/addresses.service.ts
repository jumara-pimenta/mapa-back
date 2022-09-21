import { Injectable } from '@nestjs/common';
import { Address, prisma, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async create(createAddressDto: Prisma.AddressCreateInput): Promise<Address> {
    return await this.prismaService.address.create({ data: createAddressDto})
  }

  
}
