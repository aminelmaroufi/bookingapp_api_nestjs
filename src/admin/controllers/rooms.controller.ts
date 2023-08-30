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
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
import {
  CreateHotelDto,
  GetHotelsResponseDto,
  HotelDto,
} from 'src/hotels/dto/hotel.dto';
import { AdminhGuard } from '../config/admin.guard';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';
import { RoomsService } from 'src/rooms/services/rooms.service';
import { CreateRoomDto } from 'src/rooms/dto/room.dto';

@Controller('administrators/hotels')
@ApiTags('administrators')
@UseGuards(AdminhGuard)
@UseFilters(HttpExceptionFilter)
export class AdminHotelRoomsController {
  constructor(private readonly roomService: RoomsService) {}

  //   @Get()
  //   @ApiOperation({ summary: 'Get hotels' })
  //   @ApiOkResponse({
  //     description: 'Get hotels',
  //     schema: {
  //       properties: {
  //         ok: { type: 'boolean', example: true },
  //         result: {
  //           type: 'object',
  //           properties: {
  //             message: { type: 'string', example: '' },
  //             hotels: { type: 'array', example: [] },
  //           },
  //         },
  //       },
  //     },
  //   })
  //   async getHotels(
  //     @Res() res,
  //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //     @Query('q', new DefaultValuePipe('')) query: string,
  //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   ): Promise<GetHotelsResponseDto> {
  //     try {
  //       const hotelsData = await this.hotelService.getHotels(page, limit, query);
  //       const response = {
  //         ok: true,
  //         result: {
  //           hotels: hotelsData.hotels,
  //           totalCount: hotelsData.totalCount,
  //           totalPages: hotelsData.totalPages,
  //           currentPage: hotelsData.currentPage,
  //         },
  //       };

  //       return res.json(response);
  //     } catch (error) {
  //       res.status(500).json({
  //         ok: false,
  //         result: {
  //           message: 'An error occurred while fetching hotels.',
  //         },
  //       });
  //     }
  //   }

  @Post(':id/rooms')
  @UseInterceptors(FileInterceptor('room_picture'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({
    description: 'Room data and picture',
    type: CreateRoomDto,
  })
  @ApiBadRequestResponse({
    description: 'room_picture is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'room_picture is required' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Hotel not found' })
  @ApiBadRequestResponse({
    description: 'Room title|advantage|price is required',
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
    description: 'Room created successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Room created successfully' },
            room: { type: 'object', example: CreateRoomDto },
          },
        },
      },
    },
  })
  async createRoom(
    @Param('id') hotelId: string,
    @UploadedFile() room_picture: Express.Multer.File,
    @Body() roomData: CreateRoomDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!room_picture) {
        throw new BadRequestException('room_picture is required');
      }

      const newRoom = await this.roomService.createRoom(
        hotelId,
        roomData,
        room_picture,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Room created usccessfully',
          hotel: newRoom,
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

  @Put(':id/rooms/:roomId')
  @UseInterceptors(FileInterceptor('room_picture'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({
    description: 'Room data and picture',
    type: CreateRoomDto,
  })
  @ApiBadRequestResponse({
    description: 'room_picture is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'room_picture is required' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Hotel not found' })
  @ApiBadRequestResponse({
    description: 'Room title|advantage|price is required',
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
    description: 'Room updated successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Room updated successfully' },
            room: { type: 'object', example: CreateRoomDto },
          },
        },
      },
    },
  })
  async updateRoom(
    @Param('id') hotelId: string,
    @Param('roomId') roomId: string,
    @UploadedFile() room_picture: Express.Multer.File,
    @Body() roomData: CreateRoomDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!room_picture) {
        throw new BadRequestException('room_picture is required');
      }

      const updatedRoom = await this.roomService.updateRoom(
        hotelId,
        roomId,
        roomData,
        room_picture,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Room updated usccessfully',
          hotel: updatedRoom,
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

  @Delete(':id/rooms/:roomId')
  @ApiOperation({ summary: 'Delete an existing room' })
  @ApiBadRequestResponse({ description: 'Room ID is required' })
  @ApiOkResponse({
    description: 'Room deleted successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Room deleted successfully' },
          },
        },
      },
    },
  })
  async deleteRoom(
    @Param('id') hotelId: string,
    @Param('roomId') roomId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!hotelId) throw new BadRequestException('Hotel ID is required');

      if (!roomId) throw new BadRequestException('Room ID is required');

      const deletedRoom = await this.roomService.deleteRoom(hotelId, roomId);

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: `Room ${deletedRoom.title} deleted successfully`,
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
