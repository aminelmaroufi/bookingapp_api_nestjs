import {
  BadRequestException,
  Controller,
  HttpStatus,
  Body,
  Post,
  Res,
  UseInterceptors,
  UploadedFiles,
  Put,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HotelService } from 'src/hotels/services/hotels.service';
import { CreateHotelDto } from 'src/hotels/dto/hotel.dto';
import { AdminhGuard } from '../config/admin.guard';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';

@Controller('administrators/hotels')
@UseGuards(AdminhGuard)
@UseFilters(HttpExceptionFilter)
export class AdminHotelsController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main_picture', maxCount: 1 },
      { name: 'second_picture', maxCount: 1 },
    ]),
  )
  async createHotel(
    @UploadedFiles()
    files: {
      main_picture?: Express.Multer.File;
      second_picture?: Express.Multer.File;
    },
    @Body() hotelData: CreateHotelDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const main_picture = files.main_picture[0];
      const second_picture = files.second_picture[0];

      if (!main_picture) {
        throw new BadRequestException('main_picture is required');
      }
      if (!second_picture) {
        throw new BadRequestException('second_picture is required');
      }

      const newHotel = await this.hotelService.createHotel(
        hotelData,
        main_picture,
        second_picture,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'hotel created usccessfully',
          hotel: newHotel,
        },
      });
    } catch (err) {
      res.status(err.status || 500).json({
        ok: false,
        result: {
          message: err.response || err.message,
        },
      });
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main_picture', maxCount: 1 },
      { name: 'second_picture', maxCount: 1 },
    ]),
  )
  async updateHotel(
    @Param('id') id,
    @UploadedFiles()
    files: {
      main_picture?: Express.Multer.File;
      second_picture?: Express.Multer.File;
    },
    @Body() hotelData: CreateHotelDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!id) throw new BadRequestException('Hotel ID is required');
      const main_picture = files.main_picture[0];
      const second_picture = files.second_picture[0];

      if (!main_picture) {
        throw new BadRequestException('main_picture is required');
      }
      if (!second_picture) {
        throw new BadRequestException('second_picture is required');
      }

      const newHotel = await this.hotelService.updateHotel(
        id,
        hotelData,
        main_picture,
        second_picture,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'hotel updated usccessfully',
          hotel: newHotel,
        },
      });
    } catch (err) {
      res.status(err.status || 500).json({
        ok: false,
        result: {
          message: err.response || err.message,
        },
      });
    }
  }

  @Delete(':id')
  async deleteHotel(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!id) throw new BadRequestException('Hotel ID is required');

      const deletedHotel = await this.hotelService.deleteHotel(id);

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: `Hotel ${deletedHotel.name} deleted successfully`,
        },
      });
    } catch (err) {
      res.status(err.status || 500).json({
        ok: false,
        result: {
          message: err.response || err.message,
        },
      });
    }
  }
}
