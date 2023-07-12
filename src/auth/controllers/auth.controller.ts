import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Query,
  Res,
  Req,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserCredentialsDto } from '../dto';
import { Response } from 'express';
import { LocalAuthGuard } from '../config/local.auth.guard';
import { sanitazeUser } from 'src/config/utils';
import { AuthenticatedGuard } from '../config/ authenticated.guard';
import { HttpExceptionFilter } from 'src/config/http-exception.filter';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Query('scope') scope: string,
    @Body() loginDto: UserCredentialsDto,
    @Request() req,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const { email, password } = loginDto;
      const user = await this.authService.signIn(email, password, scope);
      req.user = user;
      req.login(user, () => {
        res
          .status(HttpStatus.OK)
          .json({ ok: true, result: { user: sanitazeUser(user) } });
      });
    } catch (error) {
      res.status(500).json({ ok: false, result: { message: error.message } });
    }
  }

  @Post('signout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Request() req, @Res() res: Response) {
    try {
      req.session.destroy();
      res
        .status(HttpStatus.OK)
        .json({ ok: true, result: { message: 'Logout success' } });
      // req.logout((err) => {
      //   if (err) {
      //     res
      //       .status(HttpStatus.UNAUTHORIZED)
      //       .json({ ok: false, result: { message: err.message } });
      //   } else {
      //     res
      //       .status(HttpStatus.OK)
      //       .json({ ok: true, result: { message: 'Logout success' } });
      //   }
      // });
    } catch (error) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ ok: false, result: { message: error.message } });
    }
  }
}
