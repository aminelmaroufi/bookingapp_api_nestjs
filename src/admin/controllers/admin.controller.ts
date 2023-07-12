import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/users/services/user.service';
import { config } from '../config';
import { sanitazeUser } from 'src/config/utils';
import { HotelService } from 'src/hotels/services/hotels.service';

@Controller('administrators')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
  ) {}

  @Post('default')
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
