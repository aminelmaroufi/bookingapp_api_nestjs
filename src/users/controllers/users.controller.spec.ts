import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from '../services/user.service';
import { getModelToken } from '@nestjs/mongoose';

const mockUserService = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UserService,
        { provide: getModelToken('User'), useFactory: mockUserService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
