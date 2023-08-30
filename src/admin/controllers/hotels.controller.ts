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
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HotelService } from 'src/hotels/services/hotels.service';
import { CreateHotelDto, GetHotelsResponseDto } from 'src/hotels/dto/hotel.dto';
import { AdminhGuard } from '../config/admin.guard';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';

@Controller('administrators/hotels')
@ApiTags('administrators')
@UseGuards(AdminhGuard)
@UseFilters(HttpExceptionFilter)
export class AdminHotelsController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  @ApiOperation({ summary: 'Get hotels' })
  @ApiOkResponse({
    description: 'Get hotels',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: '' },
            hotels: { type: 'array', example: [] },
          },
        },
      },
    },
  })
  async getHotels(
    @Res() res,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('q', new DefaultValuePipe('')) query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<GetHotelsResponseDto> {
    try {
      const hotelsData = await this.hotelService.getHotels(page, limit, query);
      const response = {
        ok: true,
        result: {
          hotels: hotelsData.hotels,
          totalCount: hotelsData.totalCount,
          totalPages: hotelsData.totalPages,
          currentPage: hotelsData.currentPage,
        },
      };

      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(500).json({
        ok: false,
        result: {
          message: 'An error occurred while fetching hotels.',
        },
      });
    }
  }

  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main_picture', maxCount: 1 },
      { name: 'second_picture', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiBody({
    description: 'Hotel data and pictures',
    type: CreateHotelDto,
  })
  @ApiBadRequestResponse({
    description: 'main_picture is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'main_picture is required' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'second_picture is required' })
  @ApiBadRequestResponse({
    description:
      'hotel name|type|city|country|address|short_address|location|rating is required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Internal Server Error' },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Hotel created successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'hotel created successfully' },
            hotel: { type: 'object', example: CreateHotelDto },
          },
        },
      },
    },
  })
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
          message: 'hotel created successfully',
          hotel: newHotel,
        },
      });
    } catch (err) {
      res.status(err.status || 500).json({
        ok: false,
        result: {
          message: err.message || err.response,
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing hotel' })
  @ApiBody({
    description: 'Hotel data and pictures',
    type: CreateHotelDto,
  })
  @ApiBadRequestResponse({
    description: 'main_picture is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'main_picture is required' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'second_picture is required' })
  @ApiBadRequestResponse({
    description:
      'hotel name|type|city|country|address|short_address|location|rating is required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Internal Server Error' },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Hotel updated successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'hotel updated successfully' },
            hotel: { type: 'object', example: CreateHotelDto },
          },
        },
      },
    },
  })
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
          message: 'hotel updated successfully',
          hotel: newHotel,
        },
      });
    } catch (err) {
      res.status(err.status || 500).json({
        ok: false,
        result: {
          message: err.message || err.response,
        },
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing hotel' })
  @ApiBadRequestResponse({ description: 'Hotel ID is required' })
  @ApiOkResponse({
    description: 'Hotel updated successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'hotel deleted successfully' },
          },
        },
      },
    },
  })
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
          message: err.message || err.response,
        },
      });
    }
  }
}
