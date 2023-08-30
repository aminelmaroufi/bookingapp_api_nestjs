import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/users/services/user.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Customer } from 'src/users/schemas/customer.schema';
import { CustomerService } from 'src/users/services/customer.service';
import { sanitazeCustomer, sanitazeUser } from 'src/config/utils';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
  ) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: any, id?: any) => void,
  ): Promise<void> {
    done(null, user.id);
  }

  async deserializeUser(
    id: any,
    done: (err: any, user?: any) => void,
  ): Promise<void> {
    let user: any;
    user = await this.userService.findById(id);

    if (!user) {
      user = await this.customerService.findById(id);
      user = sanitazeCustomer(user);
    } else user = sanitazeUser(user);

    done(null, user);
  }
}
