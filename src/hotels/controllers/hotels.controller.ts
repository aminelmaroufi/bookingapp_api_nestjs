import {
  Controller,
  Get,
  Res,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HotelService } from '../services/hotels.service';
import { ResponseDto } from 'src/common/dto/response.dto'; // Import the custom response DTO
import { HotelDto } from '../dto/hotel.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelController {
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
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('query') query: any,
  ): Promise<ResponseDto> {
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

      return res.json(response);
    } catch (error) {
      res.status(500).json({
        ok: false,
        result: {
          message: 'An error occurred while fetching hotels.',
        },
      });
    }
  }
}
