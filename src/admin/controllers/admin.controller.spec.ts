import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { UserService } from '../../users/services/user.service';
import { HotelService } from '../../hotels/services/hotels.service';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { config } from '../config';

describe('AdminController', () => {
  let adminController: AdminController;
  let userService: UserService;
  let hotelService: HotelService;

  const mockUserService = {
    findByEmail: jest.fn(),
    createDefaultAdmin: jest.fn(),
  };

  const mockHotelService = {};

  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: HotelService, useValue: mockHotelService },
      ],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
    userService = module.get<UserService>(UserService);
    hotelService = module.get<HotelService>(HotelService);
  });

  describe('create', () => {
    it('should create a default admin', async () => {
      const defaultAdmin = config.defaultAdmin;
      const createdAdmin = { ...defaultAdmin, _id: 'someId' };

      mockUserService.findByEmail.mockResolvedValue(undefined);
      mockUserService.createDefaultAdmin.mockResolvedValue(createdAdmin);

      await adminController.create(mockResponse as any);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        defaultAdmin.email,
      );
      expect(mockUserService.createDefaultAdmin).toHaveBeenCalledWith(
        defaultAdmin,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: {
          message: 'Admin created successfully',
          user: expect.objectContaining({ _id: 'someId' }),
        },
      });
    });

    it('should handle error if admin already exists', async () => {
      const defaultAdmin = config.defaultAdmin;

      mockUserService.findByEmail.mockResolvedValue(defaultAdmin);

      await adminController.create(mockResponse as any);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        defaultAdmin.email,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: { message: 'Default admin already exists' },
      });
    });

    it('should handle other errors', async () => {
      const defaultAdmin = config.defaultAdmin;
      const errorMessage = 'Some error message';

      mockUserService.findByEmail.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await adminController.create(mockResponse as any);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        defaultAdmin.email,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        result: { message: errorMessage },
      });
    });
  });
});
