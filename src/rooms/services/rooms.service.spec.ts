import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { HotelService } from 'src/hotels/services/hotels.service';
import { FilesService } from 'src/files/services/files.service';
import { getModelToken } from '@nestjs/mongoose';

const mockHotelService = () => ({
  findOne: jest.fn(),
  deleteRoomFromHotel: jest.fn(),
});

const mockFileService = () => ({
  saveFile: jest.fn(),
  deleteFile: jest.fn(),
});

const mockRoomModel = () => ({
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

describe('RoomsService', () => {
  let service: RoomsService;
  let hotelService: HotelService;
  let fileService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken('Room'),
          useValue: mockRoomModel,
        },
        HotelService,
        { provide: getModelToken('Hotel'), useFactory: mockHotelService },
        FilesService,
        { provide: getModelToken('File'), useFactory: mockFileService },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    hotelService = module.get<HotelService>(HotelService);
    fileService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
