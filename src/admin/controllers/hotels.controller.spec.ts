import { Test, TestingModule } from '@nestjs/testing';
import { AdminHotelsController } from './hotels.controller';
import { HotelService } from '../../hotels/services/hotels.service';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { config } from '../config';
import * as GetHotelsResponse from './fixtures/hotels_response.json';
import {
  CreateHotelDto,
  GetHotelsResponseDto,
  HotelDto,
} from 'src/hotels/dto/hotel.dto';

describe('HAdminHotelsController', () => {
  let adminHotelsController: AdminHotelsController;
  let hotelService: HotelService;

  const mockHotelService = {
    getHotels: jest.fn(),
    createHotel: jest.fn(),
    updateHotel: jest.fn(),
    deleteHotel: jest.fn(),
  };

  let mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminHotelsController],
      providers: [{ provide: HotelService, useValue: mockHotelService }],
    }).compile();

    adminHotelsController = module.get<AdminHotelsController>(
      AdminHotelsController,
    );
    hotelService = module.get<HotelService>(HotelService);

    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    };
  });

  describe('getHotels', () => {
    it('should provides hotels', async () => {
      const hotelsData = {
        hotels: GetHotelsResponse.result.hotels,
        totalCount: GetHotelsResponse.result.totalCount,
        totalPages: GetHotelsResponse.result.totalPages,
        currentPage: GetHotelsResponse.result.currentPage,
      };

      mockHotelService.getHotels.mockResolvedValue(hotelsData);

      await adminHotelsController.getHotels(mockResponse as any, 1, '', 10);

      expect(mockHotelService.getHotels).toHaveBeenCalledWith(1, 10, '');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(GetHotelsResponse);
    });

    it('should handle error', async () => {
      mockHotelService.getHotels.mockRejectedValue(
        new Error('An error occurred'),
      );

      await adminHotelsController.getHotels(mockResponse as any, 1, '', 10);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: false,
        result: {
          message: 'An error occurred while fetching hotels.',
        },
      });
    });
  });

  describe('createHotel', () => {
    const hotelData: CreateHotelDto = {
      name: 'hotel1',
      type: 'double room',
      country: 'France',
      city: 'Paris',
      address: 'd1',
      short_address: 'sd1',
      location: 'l1',
      rating: 4,
    };

    const files = {
      main_picture: [{}] as any,
      second_picture: [{}] as any,
    };

    it('should create a new hotel', async () => {
      const newHotel = { ...hotelData, _id: '1234' };

      mockHotelService.createHotel.mockResolvedValue(newHotel);

      await adminHotelsController.createHotel(
        files,
        hotelData,
        mockResponse as any,
      );

      expect(mockHotelService.createHotel).toHaveBeenCalledWith(
        hotelData,
        files.main_picture[0],
        files.second_picture[0],
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: {
          message: 'hotel created successfully',
          hotel: newHotel,
        },
      });
    });

    it('should handle error', async () => {
      const errorMessage = 'Some error message';
      mockHotelService.createHotel.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await adminHotelsController.createHotel(
        files,
        hotelData,
        mockResponse as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: false,
        result: {
          message: errorMessage,
        },
      });
    });
  });

  describe('updateHotel', () => {
    const hotelData: CreateHotelDto = {
      name: 'hotel1',
      type: 'double room',
      country: 'France',
      city: 'Paris',
      address: 'd1',
      short_address: 'sd1',
      location: 'l1',
      rating: 4,
    };

    const files = {
      main_picture: [{}] as any,
      second_picture: [{}] as any,
    };

    it('should update a hotel', async () => {
      const hotelId = '123';
      const updatedHotel = { ...hotelData, _id: hotelId };

      mockHotelService.updateHotel.mockResolvedValue(updatedHotel);

      await adminHotelsController.updateHotel(
        hotelId,
        files,
        updatedHotel,
        mockResponse as any,
      );

      expect(mockHotelService.updateHotel).toHaveBeenCalledWith(
        hotelId,
        updatedHotel,
        files.main_picture[0],
        files.second_picture[0],
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: {
          message: 'hotel updated successfully',
          hotel: updatedHotel,
        },
      });
    });

    it('should handle error', async () => {
      const hotelId = '123';
      const errorMessage = 'Some error message';
      mockHotelService.updateHotel.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await adminHotelsController.updateHotel(
        hotelId,
        files,
        hotelData,
        mockResponse as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: false,
        result: {
          message: errorMessage,
        },
      });
    });
  });
  describe('deleteHotel', () => {
    it('should delete a hotel', async () => {
      const hotelId = '123';
      const deletedHotel = { name: 'Hotel Name' }; // Provide the deleted hotel data

      mockHotelService.deleteHotel.mockResolvedValue(deletedHotel);

      await adminHotelsController.deleteHotel(hotelId, mockResponse as any);

      expect(mockHotelService.deleteHotel).toHaveBeenCalledWith(hotelId);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: {
          message: `Hotel ${deletedHotel.name} deleted successfully`,
        },
      });
    });

    it('should handle error', async () => {
      const hotelId = '123';
      const errorMessage = 'Some error message';
      mockHotelService.deleteHotel.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await adminHotelsController.deleteHotel(hotelId, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: false,
        result: {
          message: errorMessage,
        },
      });
    });
  });
});
