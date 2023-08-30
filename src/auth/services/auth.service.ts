// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from 'src/users/services/user.service';
import { User } from 'src/users/schemas/user.schema';
import { CustomerService } from 'src/users/services/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.authenticate(password))) {
      return user;
    } else {
      const customer = await this.customerService.findByEmail(email);

      if (customer && (await customer.authenticate(password))) return customer;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserById(userId: string): Promise<any> {
    return this.userService.findById(userId);
  }

  async signIn(email: string, password: string, scope: string): Promise<User> {
    const user = await this.validateUser(email, password);

    if (!user.roles.includes(scope))
      throw new UnauthorizedException('Wrong scope');

    delete user.password;
    return user;
  }
}
