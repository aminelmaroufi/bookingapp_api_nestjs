import { Module } from '@nestjs/common';
import { BookingSchema } from './schemas/booking.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingService } from './services/booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
  ],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
