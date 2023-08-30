import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Customer } from '../schemas/customer.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { CardDto, CreateCardDto } from '../dto/card.dto';
import { UserCardsService } from './card.service';
import { Booking } from 'src/booking/schemas/booking.schema';
import { CreateBookingDto } from 'src/booking/dto/booking.dto';
import { HotelService } from 'src/hotels/services/hotels.service';
import { RoomsService } from 'src/rooms/services/rooms.service';
import { BookingService } from 'src/booking/services/booking.service';

@Injectable()
export class CustomerService {
  private readonly stripe: Stripe;

  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly cardService: UserCardsService,
    private readonly hotelService: HotelService,
    private readonly roomService: RoomsService,
    private readonly bookingService: BookingService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_KEY_SECRET, {
      apiVersion: null,
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }

  async findById(id: string): Promise<Customer | null> {
    return this.customerModel
      .findById(id)
      .populate({ path: 'cards', select: 'id brand number' })
      .exec();
  }

  async createCustomer(customerData: CreateUserDto): Promise<Customer> {
    const errors = await validate(plainToClass(CreateUserDto, customerData));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    if (customerData.password !== customerData.confirm_password)
      throw new BadRequestException(
        "Password and Confirm password dosen't match",
      );

    // Create the user in Stripe
    const customer = await this.stripe.customers.create({
      email: customerData.email,
      name: customerData.firstname + ' ' + customerData.lastname,
      phone: customerData.phone,
    });

    if (!customer)
      throw new BadRequestException('Error creating customer from stripe API');

    return this.customerModel.create({
      ...customerData,
      stripeId: customer.id,
      provider: 'local',
      roles: ['customer'],
    });
  }

  async addCard(userId: string, cardData: CreateCardDto): Promise<CardDto> {
    const customer = await this.customerModel.findById(userId).exec();

    if (!customer) throw new NotFoundException('Customer not found');

    return this.cardService.createCard(cardData, customer);
  }

  async book(
    customerId: string,
    bookingData: CreateBookingDto,
  ): Promise<Booking> {
    const customer = await this.findOne(customerId);

    if (!customer) throw new NotFoundException('Customer not found');

    const hotel = await this.hotelService.findOne(bookingData.hotel);

    if (!hotel) throw new NotFoundException('Hotel not found');

    const room = await this.roomService.findOne(bookingData.room);

    if (!room) throw new NotFoundException('Room not found');

    const card = await this.cardService.findOne(bookingData.card);

    if (!card) throw new NotFoundException('Payment Method Card not found');

    return this.bookingService.createBooking(bookingData, customer, card);
  }

  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const customer = await this.findOne(customerId);

    if (!customer) throw new NotFoundException('Customer not found');

    return this.bookingService.customerBookings(customerId);
  }
}
