import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { UserCardsService } from './card.service';
import { Card } from '../schemas/card.schema';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mpckCardModel = {
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('UserCardsService', () => {
  let userCardsService: UserCardsService;
  let customerModelMock: Model<CustomerDocument>;
  let cardModelMock: Model<Card>;
  let stripeMock: Stripe;

  const mockCardData = {
    name: 'John Doe',
    number: '4242424242424242',
    cvc: '123',
    expire_date: '12/25',
  };

  const mockCustomer = {
    _id: 'customerId',
    stripeId: 'stripeCustomerId',
    token: 'stripeTokenId',
    cards: [],
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCardsService,
        {
          provide: getModelToken(Card.name),
          useValue: mpckCardModel,
        },
      ],
    }).compile();

    userCardsService = module.get<UserCardsService>(UserCardsService);
    cardModelMock = module.get<Model<Card>>(getModelToken(Card.name));

    stripeMock = {
      tokens: {
        create: jest.fn(),
      },
      customers: {
        createSource: jest.fn(),
      },
    } as unknown as Stripe;

    userCardsService['stripe'] = stripeMock;
  });

  describe('findOne', () => {
    it('should find a card by ID', async () => {
      const mockCard = {
        _id: '1234',
        stripeId: 'card_1234',
        brand: 'MasterCard',
        number: '4444',
      };
      const cardId = '1234';
      (cardModelMock.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCard),
      });

      const result = await userCardsService.findOne(cardId);

      expect(result).toEqual(mockCard);
      expect(cardModelMock.findById).toHaveBeenCalledWith(cardId);
    });
  });

  describe('createCard', () => {
    it('should create a new card and associate it with a customer', async () => {
      const mockToken = { id: 'stripeTokenId' };
      const mockStripeCard = {
        id: 'card_1234',
        brand: 'MasterCard',
        last4: '4444',
      };
      const mockCreatedCard = {
        _id: '1234',
        stripeId: 'card_1234',
        brand: 'MasterCard',
        number: '4444',
      };

      (stripeMock.tokens.create as jest.Mock).mockResolvedValue(mockToken);
      (stripeMock.customers.createSource as jest.Mock).mockResolvedValue(
        mockStripeCard,
      );
      (cardModelMock.create as jest.Mock).mockResolvedValue(mockCreatedCard);

      const result = await userCardsService.createCard(
        mockCardData,
        mockCustomer as any,
      );

      expect(result).toEqual(mockCreatedCard);
      expect(cardModelMock.create).toHaveBeenCalledWith({
        stripeId: mockStripeCard.id,
        brand: mockStripeCard.brand,
        number: mockStripeCard.last4,
      });
      expect(cardModelMock.create).toHaveBeenCalledWith({
        stripeId: 'card_1234',
        brand: 'MasterCard',
        number: '4444',
      });
    });

    it('should throw BadRequestException if validation fails', async () => {
      const mockInvalidCardData = {
        name: 'John Doe',
        number: '424242424242', // Invalid number
        cvc: '123',
      };
      const mockValidationErrors = [{ constraints: 'Validation error' }];

      jest.mock('class-validator', () => ({
        validate: jest.fn().mockResolvedValue(mockValidationErrors),
      }));

      await expect(
        userCardsService.createCard(mockInvalidCardData as any, {} as any),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('removeCard', () => {
    it('should remove a card by id', async () => {
      const mockCardId = '1234';
      const mockDeletedCard = {
        _id: mockCardId,
        stripeId: 'card_1234Vbn',
        brand: 'Visa',
        number: '4242',
      };

      (cardModelMock.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockDeletedCard,
      );

      const result = await userCardsService.removeCard(mockCardId);

      expect(result).toEqual(mockDeletedCard);
      expect(cardModelMock.findByIdAndDelete).toHaveBeenCalledWith(mockCardId);
    });

    it('should throw NotFoundException if card with given id is not found', async () => {
      const mockCardId = '1234';

      (cardModelMock.findByIdAndDelete as jest.Mock).mockReturnValue(
        Promise.reject({
          message: 'Card not found',
        }),
      );

      try {
        await userCardsService.removeCard(mockCardId);
      } catch (error) {
        expect(error.message).toEqual('Card not found');
      }

      // Assert that the cardModel method was called once
      expect(cardModelMock.findByIdAndDelete).toBeCalledWith(mockCardId);
    });
  });
});
