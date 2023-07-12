import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './services/rooms.service';
import { RoomsController } from './controllers/rooms.controller';
import { RoomSchema } from './schemas/room.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
