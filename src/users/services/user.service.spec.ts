import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
// import { Model, Query } from 'mongoose';
import { UserService } from './user.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { mock } from 'node:test';

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userModelMock: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModelMock = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = {
        _id: '1234',
        firstname: 'test',
        lastname: 'test',
        email: 'test@example.com',
        phone: '',
        roles: ['user'],
      };

      (userModelMock.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await userService.findByEmail(email);

      expect(result).toEqual(user);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = '1234';
      const user = {
        _id: '1234',
        firstname: 'test',
        lastname: 'test',
        email: 'test@example.com',
        phone: '',
        roles: ['user'],
      };

      (userModelMock.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await userService.findById(userId);

      expect(result).toEqual(user);
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('createDefaultAdmin', () => {
    it('should create a default admin', async () => {
      const adminData = {
        firstname: 'test',
        lastname: 'test',
        email: 'admin@example.com',
        phone: '',
        roles: ['admin'],
      };
      const createdAdmin = { ...adminData, _id: '1234', roles: ['admin'] };

      jest
        .spyOn(userModelMock, 'create')
        .mockResolvedValue(createdAdmin as any);

      const result = await userService.createDefaultAdmin(adminData);

      expect(result).toEqual(createdAdmin);
      expect(userModelMock.create).toHaveBeenCalledWith(adminData);

      expect(userModelMock.create).toHaveBeenCalled();
    });
  });
});
