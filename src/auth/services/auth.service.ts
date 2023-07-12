// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from 'src/users/services/user.service';
import { JWDto } from '../config/dto/jwt.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    // console.log('password match:', await user.authenticate(password)));
    if (user && (await user.authenticate(password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserById(userId: string): Promise<any> {
    return this.userService.findById(userId);
  }

  async signIn(email: string, password: string, scope: string): Promise<User> {
    const user: any = await this.validateUser(email, password);

    if (!user.roles.includes(scope))
      throw new UnauthorizedException('Wrong scope');
    const payload: JWDto = { email: user.email, userId: user._id };
    const token = this.jwtService.sign(payload);
    delete user.password;
    return user;
  }
}
