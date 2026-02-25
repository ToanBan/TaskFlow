import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MinioService } from 'src/miniO/minio.service';
@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly minioService: MinioService,
  ) {}

  async getProfile(contextUser: any) {
    try {
      const email = contextUser.email;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
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
    avatar: Express.Multer.File | null,
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
      let avatarUrl = existingUser.avatar;
      let objectKey: string | null = null;
      if (avatar) {
        objectKey = `avatars/${contextUser.sub}.webp`;
        console.log('Uploading avatar to Minio with key:', objectKey);
        await this.minioService.uploadWithKey(objectKey, avatar);
        avatarUrl = objectKey
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
          avatar: avatarUrl,
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
