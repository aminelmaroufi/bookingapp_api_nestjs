import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Room } from '../schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/services/files.service';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HotelService } from 'src/hotels/services/hotels.service';
import { CreateRoomDto } from '../dto/room.dto';
import { HotelsModule } from 'src/hotels/hotels.module';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private readonly hotelService: HotelService,
    private readonly filesService: FilesService,
  ) {}

  findAll() {
    return this.roomModel.find().exec();
  }

  findOne(id: string) {
    return this.roomModel.findById(id).exec();
  }

  async createRoom(
    hotelId: string,
    data: any,
    room_picture: Express.Multer.File,
  ): Promise<Room> {
    const hotel = await this.hotelService.findOne(hotelId);

    if (!hotel)
      throw new NotFoundException('Hotel not found with the getting id');

    data.price = +data.price;
    const errors = await validate(plainToClass(CreateRoomDto, data));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const newRoomPic = await this.filesService.saveFile(room_picture.filename);

    // const hotel = new this.hotelModel(data);
    const room = new this.roomModel({
      ...data,
      room_picture: newRoomPic._id,
    });

    hotel.rooms.push(room._id);

    await hotel.save();
    return room.save();
  }

  async deleteRoom(hotelId: string, roomlId: string) {
    const hotel = await this.hotelService.deleteRoomFromHotel(hotelId, roomlId);

    if (!hotel)
      throw new NotFoundException('Hotel not found with the getting id');

    const deletedRoom = await this.roomModel.findByIdAndDelete(roomlId);

    if (!deletedRoom) {
      throw new NotFoundException('Room not found');
    }

    const room_picture = await this.filesService.deleteFile(
      deletedRoom.room_picture,
    );

    return deletedRoom;
  }

  async updateRoom(
    hotelId: string,
    roomId: string,
    data: any,
    room_picture: Express.Multer.File,
  ): Promise<Room> {
    const hotel = await this.hotelService.findOne(hotelId);

    if (!hotel)
      throw new NotFoundException('Hotel not found with the getting id');

    data.price = +data.price;
    const errors = await validate(plainToClass(CreateRoomDto, data));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const updatedRoom = await this.roomModel.findById(roomId).exec();

    if (!updatedRoom) {
      throw new NotFoundException('Hotel not found');
    }

    const prevRoomPic = await this.filesService.deleteFile(
      updatedRoom.room_picture,
    );
    const newRoomPic = await this.filesService.saveFile(room_picture.filename);

    updatedRoom.title = data.title;
    updatedRoom.advantage = data.advantage;
    updatedRoom.price = data.price;
    updatedRoom.room_picture = newRoomPic._id;

    return updatedRoom.save();
  }
}
