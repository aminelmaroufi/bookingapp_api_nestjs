import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'src/users/services/user.service';
import { config } from '../config';
import { sanitazeUser } from 'src/config/utils';
import { HotelService } from 'src/hotels/services/hotels.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('administrators')
@Controller('administrators')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
  ) {}

  @Post('default')
  @ApiOperation({ summary: 'Create a default admin' })
  @ApiBadRequestResponse({ description: 'Default admin already exists' })
  @ApiOkResponse({
    description: 'Admin created successfully',
    schema: {
      properties: {
        ok: { type: 'boolean', example: true },
        result: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Admin created successfully' },
            user: { type: 'object', example: CreateUserDto },
          },
        },
      },
    },
  })
  async create(@Res() res: Response): Promise<any> {
    const { defaultAdmin } = config;
    try {
      const existingAdmin = await this.userService.findByEmail(
        defaultAdmin.email,
      );

      if (existingAdmin)
        throw new BadRequestException('Default admin already exists');

      const admin = await this.userService.createDefaultAdmin(defaultAdmin);

      res.status(HttpStatus.OK).json({
        ok: true,
        result: {
          message: 'Admin created successfully',
          user: sanitazeUser(admin),
        },
      });
    } catch (err) {
      res.status(err.status).json({
        ok: true,
        result: { message: err.message },
      });
    }
  }
}
