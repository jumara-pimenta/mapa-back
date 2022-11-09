import { BadGatewayException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaCodeError, PrismaMessageError } from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAddress } from '../dtos/address/createAddress.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createAddress: CreateAddress): Promise<CreateAddress> {
    try{
    const address = await this.prismaService.address.create({
      data: createAddress,
    });
    return address
  }catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaCodeError.UNIQUE_CONSTRAINT
    ) {
      throw new BadGatewayException(
        PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
      );
    }
    throw error;
  }
  }
  
}
