import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminhGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Check if the user has admin permissions
    if (user && user.roles.includes('admin')) return true;
    throw new UnauthorizedException(
      'Only administrators are allowed to access this resource',
    );
  }
}
