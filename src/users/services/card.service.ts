import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Stripe from 'stripe';
import { Card } from '../schemas/card.schema';
import { Model } from 'mongoose';
import { CardDto, CreateCardDto } from '../dto/card.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer } from '../schemas/customer.schema';

@Injectable()
export class UserCardsService {
  private stripe: Stripe;

  constructor(@InjectModel(Card.name) private cardModel: Model<Card>) {
    this.stripe = new Stripe(process.env.STRIPE_KEY_SECRET, {
      apiVersion: null,
    });
  }

  async findOne(id: string): Promise<Card> {
    return this.cardModel.findById(id).exec();
  }

  async createCard(
    cardData: CreateCardDto,
    customer: Customer,
  ): Promise<CardDto> {
    const errors = await validate(plainToClass(CreateCardDto, cardData));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const exp_month = cardData.expire_date.split('/')[0];
    const exp_year = cardData.expire_date.split('/')[1];

    const token = await this.stripe.tokens.create({
      card: {
        name: cardData.name,
        number: cardData.number.replace(/\s/g, ''),
        cvc: cardData.cvc,
        exp_month,
        exp_year,
      },
    });

    const stripeCard = (await this.stripe.customers.createSource(
      customer.stripeId,
      {
        source: token.id,
      },
    )) as Stripe.Response<Stripe.Card>;

    const newCard = await this.cardModel.create({
      stripeId: stripeCard.id,
      brand: stripeCard.brand,
      number: stripeCard.last4,
    });

    customer.token = token.id;
    customer.cards.push(newCard._id);

    await customer.save();

    return newCard;
  }

  removeCard(id: string): Promise<CardDto> {
    return this.cardModel.findByIdAndDelete(id);
  }
}
