import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/users/services/user.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(
    user: UserDocument,
    done: (err: any, id?: any) => void,
  ): Promise<void> {
    done(null, user.id);
  }

  async deserializeUser(
    id: any,
    done: (err: any, user?: any) => void,
  ): Promise<void> {
    const user = await this.userService.findById(id);
    done(null, user);
  }
}
