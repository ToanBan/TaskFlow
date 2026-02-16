import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getProfile(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      });
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      return { user };
    } catch (error) {
      console.log('VERIFY ERROR:', error.name, error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
