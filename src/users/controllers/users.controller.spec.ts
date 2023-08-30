import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CustomerService } from '../services/customer.service';

const mockCustomerService = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  createCustomer: jest.fn(),
  addCard: jest.fn(),
  book: jest.fn(),
  getCustomerBookings: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: CustomerService, useValue: mockCustomerService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
