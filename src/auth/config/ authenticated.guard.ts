import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) return true;
    throw new UnauthorizedException(
      'Resource not allowed, no session found for the current user',
    );
  }
}
