import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Check if the user has admin permissions
    if (!user) return true;

    throw new UnauthorizedException(
      'Only guest users are allowed to access this resource',
    );
  }
}
