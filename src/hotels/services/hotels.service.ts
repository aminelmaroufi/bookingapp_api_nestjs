import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Hotel, HotelDocument } from '../schemas/hotel.schema';
import { HotelDto, CreateHotelDto } from '../dto/hotel.dto';
import { FilesService } from 'src/files/services/files.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    private readonly filesService: FilesService,
  ) {}

  async getHotels(page = 1, limit = 10, query = '') {
    let filters = {};
    const regexQuery = new RegExp(query, 'i');

    if (query) {
      filters = {
        $or: [
          { name: { $regex: regexQuery } },
          { city: { $regex: regexQuery } },
          { country: { $regex: regexQuery } },
        ],
      };
    }
    const totalCount = await this.hotelModel.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / limit);

    const hotels = await this.hotelModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      hotels: hotels.map((hotel) => this.mapHotelToDto(hotel)),
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async createHotel(
    data: any,
    main_picture: Express.Multer.File,
    second_picture: Express.Multer.File,
  ): Promise<Hotel> {
    data.rating = parseInt(data.rating);
    const errors = await validate(plainToClass(CreateHotelDto, data));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const newMainPic = await this.filesService.saveFile(main_picture.filename);
    const newSecondPic = await this.filesService.saveFile(
      second_picture.filename,
    );

    // const hotel = new this.hotelModel(data);
    const hotel = new this.hotelModel({
      ...data,
      main_picture: newMainPic._id,
      second_picture: newSecondPic._id,
    });

    return hotel.save();
  }

  async updateHotel(
    hotelId: any,
    data: any,
    main_picture: Express.Multer.File,
    second_picture: Express.Multer.File,
  ): Promise<Hotel> {
    data.rating = parseInt(data.rating);
    const errors = await validate(plainToClass(CreateHotelDto, data));

    if (errors.length > 0) {
      throw new BadRequestException(errors[0].constraints);
    }

    const updatedHotel = await this.hotelModel.findById(hotelId).exec();

    if (!updatedHotel) {
      throw new NotFoundException('Hotel not found');
    }

    const prevMainPic = await this.filesService.deleteFile(
      updatedHotel.main_picture,
    );
    const newMainPic = await this.filesService.saveFile(main_picture.filename);

    const prevSecondPic = await this.filesService.deleteFile(
      updatedHotel.second_picture,
    );
    const newSecondPic = await this.filesService.saveFile(
      second_picture.filename,
    );

    updatedHotel.name = data.name;
    updatedHotel.type = data.type;
    updatedHotel.city = data.city;
    updatedHotel.country = data.country;
    updatedHotel.address = data.address;
    updatedHotel.short_address = data.short_address;
    updatedHotel.location = data.location;
    updatedHotel.rating = data.rating;
    updatedHotel.main_picture = newMainPic._id;
    updatedHotel.second_picture = newSecondPic._id;

    return updatedHotel.save();
  }

  async deleteHotel(id: string): Promise<Hotel> {
    const deletedHotel = await this.hotelModel.findByIdAndDelete(id);

    if (!deletedHotel) {
      throw new NotFoundException('Hotel not found');
    }

    const mainPic = await this.filesService.deleteFile(
      deletedHotel.main_picture,
    );
    const secondPic = await this.filesService.deleteFile(
      deletedHotel.second_picture,
    );
    return deletedHotel;
  }

  private mapHotelToDto(hotel: HotelDocument): HotelDto {
    const {
      _id,
      name,
      rating,
      short_address,
      city,
      rooms,
      country,
      address,
      location,
      type,
      created_at,
      updated_at,
      main_picture,
      second_picture,
    } = hotel;
    return {
      _id,
      name,
      rating,
      short_address,
      city,
      rooms,
      country,
      address,
      location,
      type,
      created_at,
      updated_at,
      main_picture,
      second_picture,
    };
  }
}
