import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelService } from './services/hotels.service';
import { HotelController } from './controllers/hotels.controller';
import { HotelSchema } from './schemas/hotel.schema';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forFeature([{ name: 'Hotel', schema: HotelSchema }]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelsModule {}
