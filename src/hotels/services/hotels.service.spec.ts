import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { HotelService } from './hotels.service';
import { FilesService } from 'src/files/services/files.service';
import { Hotel } from '../schemas/hotel.schema';
import * as getHotelsMockResponse from './fixtures/getHotels_response.json';
import { File } from 'src/files/schemas/file.schema';

const mockHotelModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn(),
});

const mockFileService = () => ({
  saveFile: jest.fn(),
  deleteFile: jest.fn(),
});

describe('HotelService', () => {
  let hotelService: HotelService;
  let fileService: FilesService;
  let hotelModel: Model<Hotel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        { provide: getModelToken(Hotel.name), useValue: mockHotelModel },
        FilesService,
        {
          provide: getModelToken(File.name),
          useFactory: mockFileService,
        },
      ],
    }).compile();

    hotelService = module.get<HotelService>(HotelService);
    fileService = module.get<FilesService>(FilesService);
    hotelModel = module.get<Model<Hotel>>(getModelToken('Hotel'));
  });

  it('should be defined', () => {
    expect(hotelService).toBeDefined();
  });

  describe('getHotels', () => {
    it('should return hotels with pagination information', async () => {
      const query = 'Paris';
      const page = 1;
      const limit = 10;

      jest
        .spyOn(hotelModel, 'countDocuments')
        .mockReturnValueOnce(
          Promise.resolve(getHotelsMockResponse.result.totalCount) as any,
        );

      // (mockHotelModel.countDocuments as jest.Mock).mockResolvedValue(
      //   getHotelsMockResponse.result.totalCount,
      // );

      jest.spyOn(hotelModel, 'find').mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest
          .fn()
          .mockResolvedValueOnce(getHotelsMockResponse.result.hotels),
      } as unknown as Query<Hotel[], Hotel, any>);

      const result = await hotelService.getHotels(page, limit, query);

      expect(result.hotels).toEqual(getHotelsMockResponse.result.hotels);
      expect(result.totalCount).toBe(getHotelsMockResponse.result.totalCount);
      expect(result.totalPages).toBe(getHotelsMockResponse.result.totalPages);
      expect(result.currentPage).toBe(getHotelsMockResponse.result.currentPage);
      expect(hotelModel.countDocuments).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: new RegExp(query, 'i') } },
          { city: { $regex: new RegExp(query, 'i') } },
          { country: { $regex: new RegExp(query, 'i') } },
        ],
      });
      expect(hotelModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: new RegExp(query, 'i') } },
          { city: { $regex: new RegExp(query, 'i') } },
          { country: { $regex: new RegExp(query, 'i') } },
        ],
      });
    });
  });
});
