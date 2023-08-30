import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../schemas/booking.schema';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { BookingDto, CreateBookingDto } from '../dto/booking.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Customer } from 'src/users/schemas/customer.schema';
import { Card } from 'src/users/schemas/card.schema';

@Injectable()
export class BookingService {
  private readonly stripe: Stripe;
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) {
    this.stripe = new Stripe(process.env.STRIPE_KEY_SECRET, {
      apiVersion: null,
    });
  }

  async createBooking(
    bookingData: CreateBookingDto,
    customer: Customer,
    card: Card,
  ): Promise<Booking> {
    const errors = await validate(plainToClass(CreateBookingDto, bookingData));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const newBooking = new this.bookingModel(bookingData);

    const charge = await this.stripe.paymentIntents.create({
      amount: bookingData.amount,
      currency: 'eur',
      customer: customer.stripeId,
      payment_method: card.stripeId,
      off_session: true,
      confirm: true,
      description: `${bookingData.amount} for booking: ${newBooking.id}`,
    });
    newBooking.customer = customer.id;
    newBooking.payment_auth = charge.id;

    return newBooking.save();
  }

  async customerBookings(customerId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ customer: customerId })
      .populate({
        path: 'hotel',
        select: 'id name type city country address short_address location',
      })
      .populate({
        path: 'room',
        select: 'id title advantage price',
      })
      .exec();
  }
}
