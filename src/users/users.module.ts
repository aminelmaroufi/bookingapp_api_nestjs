import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/users.controller';
import { UserSchema } from './schemas/user.schema';
import { CustomerSchema } from './schemas/customer.schema';
import { CardSchema } from './schemas/card.schema';
import { CustomerService } from './services/customer.service';
import { UserCardsService } from './services/card.service';
import { HotelsModule } from 'src/hotels/hotels.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Card', schema: CardSchema },
    ]),
    HotelsModule,
    RoomsModule,
    BookingModule,
  ],
  controllers: [UsersController],
  providers: [UserService, CustomerService, UserCardsService],
  exports: [UserService, CustomerService],
})
export class UsersModule {}
