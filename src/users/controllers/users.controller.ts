import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { CustomerService } from '../services/customer.service';
import { CustomerGuard } from '../config/curomer.guard';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';
import { sanitazeUser } from 'src/config/utils';
import { UserDto } from '../dto';
import { AuthenticatedGuard } from 'src/auth/config/ authenticated.guard';
import { CreateCardDto } from '../dto/card.dto';
import { BookingDto, CreateBookingDto } from 'src/booking/dto/booking.dto';

@ApiTags('users')
@UseFilters(HttpExceptionFilter)
@Controller('')
export class UsersController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({
    description: 'Get current user',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: '' },
            currUser: { type: 'object', example: UserDto },
          },
        },
      },
    },
  })
  @Get('me')
  getProfile(@Req() req: Request, @Res() res: Response) {
    let currUser = null;
    try {
      if (req.user) currUser = req.user;

      res
        .status(HttpStatus.OK)
        .json({ ok: true, result: { message: '', currUser } });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ ok: false, result: { message: error.message } });
    }
  }

  @Post('users')
  @UseGuards(CustomerGuard)
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({
    description: 'Account data',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Firstname is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Firstname is required' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: ' firstname|lastname|email|password|phone is required',
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
    description: 'HotAccountel created successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Account created successfully',
            },
            user: { type: 'object', example: CreateUserDto },
          },
        },
      },
    },
  })
  async createCustomer(
    @Body() customerData: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const newCustomer = await this.customerService.createCustomer(
        customerData,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Account created successfully',
          user: sanitazeUser(newCustomer),
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

  @Post('users/:id/cards')
  @UseGuards(AuthenticatedGuard)
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Add new payment method' })
  @ApiBody({
    description: 'Card data',
    type: CreateCardDto,
  })
  @ApiBadRequestResponse({
    description: 'Card name is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Card name is required' },
          },
        },
      },
    },
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
    description: 'HotAccountel created successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Payment method added successfully',
            },
            card: { type: 'object', example: CreateCardDto },
          },
        },
      },
    },
  })
  async addCard(
    @Param('id') customerId: string,
    @Body() cardrData: CreateCardDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!customerId)
        throw new BadRequestException('Customer ID is not valid or empty');

      const newCard = await this.customerService.addCard(customerId, cardrData);

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Payment added successfully',
          card: newCard,
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

  @Post('users/:id/bookings')
  @UseGuards(AuthenticatedGuard)
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Add new booking' })
  @ApiBody({
    description: 'Booking data',
    type: CreateBookingDto,
  })
  @ApiBadRequestResponse({
    description: 'Customer is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Customer is required' },
          },
        },
      },
    },
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
    description: 'Booking added successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Booking added successfully',
            },
            booking: { type: 'object', example: BookingDto },
          },
        },
      },
    },
  })
  async addBooking(
    @Param('id') customerId: string,
    @Body() bookingData: CreateBookingDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!customerId)
        throw new BadRequestException('Customer ID is not valid or empty');

      const newBooking = await this.customerService.book(
        customerId,
        bookingData,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Payment added successfully',
          booking: newBooking,
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

  @Get('users/:id/bookings')
  @UseGuards(AuthenticatedGuard)
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Get customer bookings' })
  @ApiBadRequestResponse({
    description: 'Customer is required',
    schema: {
      properties: {
        ok: { type: 'boolean', example: false },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Customer ID is required' },
          },
        },
      },
    },
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
    description: 'Get customer Bookings successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            bookings: { type: 'array', example: [] },
          },
        },
      },
    },
  })
  async getBooking(
    @Param('id') customerId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!customerId)
        throw new BadRequestException('Customer ID is not valid or empty');

      const bookins = await this.customerService.getCustomerBookings(
        customerId,
      );

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Payment added successfully',
          bookins,
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
