import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
// import { CreateUserDto } from '../dto/create-user.dto';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

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
}
