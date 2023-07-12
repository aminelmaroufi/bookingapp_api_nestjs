import { Test, TestingModule } from '@nestjs/testing';
import { HotelController } from './hotels.controller';
import { HotelService } from '../services/hotels.service';
import * as getHotelsMockResponse from '../services/fixtures/getHotels_response.json';

const mockHotelService = () => ({
  getHotels: jest.fn(),
});

describe('HotelsController', () => {
  let hotelController: HotelController;
  let hotelService: HotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelController],
      providers: [
        HotelService,
        { provide: HotelService, useFactory: mockHotelService },
      ],
    }).compile();

    hotelController = module.get<HotelController>(HotelController);
    hotelService = module.get<HotelService>(HotelService);
  });

  it('should be defined', () => {
    expect(hotelController).toBeDefined();
  });

  describe('getHotels', () => {
    it('should return an array of hotels', async () => {
      const limit = 10;
      const page = 1;
      const query = '';
      const resultData = JSON.parse(
        JSON.stringify(getHotelsMockResponse.result),
      );
      const returnedValue = {
        hotels: resultData.hotels,
        totalCount: resultData.totalCount,
        totalPages: resultData.totalPages,
        currentPage: resultData.currentPage,
      };

      jest.spyOn(hotelService, 'getHotels').mockResolvedValue(returnedValue);

      const res = {
        json: jest.fn().mockReturnValue(getHotelsMockResponse),
        status: jest.fn().mockReturnThis(),
      };

      const result = await hotelController.getHotels(res, page, limit, query);

      expect(hotelService.getHotels).toHaveBeenCalledWith(page, limit, query);
      expect(res.json).toHaveBeenCalledWith(result);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return an error response when an error occurs', async () => {
      jest
        .spyOn(hotelService, 'getHotels')
        .mockRejectedValue(new Error('Database connection failed'));

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const page = 1;
      const limit = 10;
      const query = '';

      await hotelController.getHotels(res, page, limit, query);

      expect(hotelService.getHotels).toHaveBeenCalledWith(page, limit, query);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        ok: false,
        result: {
          message: 'An error occurred while fetching hotels.',
        },
      });
    });
  });
});
