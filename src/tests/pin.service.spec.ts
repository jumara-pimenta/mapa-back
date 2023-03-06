/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test, TestingModule } from '@nestjs/testing';
import { PinService } from '../services/pin.service';
import { createMock } from '@golevelup/ts-jest';
import IPinRepository from '../repositories/pin/pin.repository.contract';
import { Pin } from '../entities/pin.entity';

const PinRepositoryMock = createMock<IPinRepository>();

const pin = {
  title: 'Título do local21211 ext23ra',
  local: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
  details: 'Detalhes do local',
  lat: '-60.0261',
  lng: '-3.10719',
};

const pinCreated = new Pin({ ...pin });
let result: any;

describe('PinService', () => {
  let pinService: PinService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [
        PinService,
        {
          provide: 'IPinRepository',
          useValue: PinRepositoryMock,
        },
      ], // Add
    }).compile();

    pinService = moduleRef.get<PinService>(PinService);
  });

  it('should be defined', () => {
    expect(pinService).toBeDefined();
  });

  it('should create a new pin', async () => {
    jest.spyOn(PinRepositoryMock, 'create').mockResolvedValueOnce(new Pin(pin));
    result = await pinService.create({ ...pin });

    expect(result).toBeDefined();
  });

  it('should find a pin', async () => {
    jest.spyOn(PinRepositoryMock, 'findById').mockResolvedValueOnce(pinCreated);
    const find = await pinService.listById(result.id);

    expect(find).toBeDefined();
  });

  it('should update a pin', async () => {
    jest.spyOn(PinRepositoryMock, 'update').mockResolvedValueOnce(pinCreated);
    const update = await pinService.update(result.id, { ...pin });

    expect(update).toBeDefined();
  });

  it('should delete a pin', async () => {
    jest.spyOn(PinRepositoryMock, 'delete').mockResolvedValueOnce(pinCreated);
    const deleted = await pinService.delete(result.id);

    expect(deleted).toBeDefined();
  });
});
