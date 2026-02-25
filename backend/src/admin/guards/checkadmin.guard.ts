import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

export class CheckAdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const userId = request.user.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.role !== 'ADMIN') {
        throw new UnauthorizedException('Admin access required');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalid or expired');
    }
  }
}
