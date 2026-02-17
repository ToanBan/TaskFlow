import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async editProfile(
    contextUser: any,
    username: string,
    address: string,
    phone: string,
    description: string,
  ) {
    try {
      const email = contextUser.email;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('Not found User');
      }

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          username: username ?? existingUser.username,
          address: address ?? existingUser.address,
          phone: phone ?? existingUser.phone,
          description: description ?? existingUser.description,
        },
      });

      return {
        message: 'Update User Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async deleteProfile(user: any) {
    try {
      const email = user.email;
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('Not found User');
      }

      await this.prisma.user.update({
        where: { email },
        data: {
          isActive: false,
        },
      });

      return {
        message: 'User deactivated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
