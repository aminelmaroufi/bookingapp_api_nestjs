import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './services/rooms.service';
import { RoomsController } from './controllers/rooms.controller';
import { RoomSchema } from './schemas/room.schema';
import { FilesModule } from 'src/files/files.module';
import { HotelsModule } from 'src/hotels/hotels.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    FilesModule,
    HotelsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
