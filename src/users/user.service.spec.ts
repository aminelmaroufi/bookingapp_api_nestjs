import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
// import { Model, Query } from 'mongoose';
import { UserService } from './services/user.service';

const mockUserModel = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createDefaultAdmin: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken('User'), useFactory: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
