import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from '../services/rooms.service';
import { getModelToken } from '@nestjs/mongoose';

const mockRoomService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
});

describe('RoomsController', () => {
  let controller: RoomsController;
  let roomService: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: mockRoomService }],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    roomService = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
