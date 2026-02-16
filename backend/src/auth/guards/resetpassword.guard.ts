import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { token } = request.body;

    if (!token) {
      throw new BadRequestException('Token is required');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.RESET_TOKEN,
      });

      if (payload.type !== 'reset') {
        throw new BadRequestException('Invalid token type');
      }

      request.resetUser = payload;
      return true;
    } catch (error) {
      throw new BadRequestException('Token invalid or expired');
    }
  }
}