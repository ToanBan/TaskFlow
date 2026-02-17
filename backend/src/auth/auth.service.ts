import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { Response } from 'express';
import { error } from 'console';
@Injectable()
export class AuthencationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let isActive = existingUser.isActive;

    if (!isActive) {
      const token = this.jwtService.sign(
        {
          sub: existingUser.id,
          email: existingUser.email,
          type: 'active',
        },
        {
          secret: process.env.ACTIVE_TOKEN,
          expiresIn: '15m',
        },
      );

      if (!existingUser.username || !existingUser.email) {
        throw new NotFoundException('Not Found');
      }

      await this.mailService.activeAccount(
        existingUser.email,
        existingUser.username,
        token,
      );
      return {
        nonActive: true,
      };
    }

    const payload = {
      sub: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.userDevice.create({
      data: {
        userId: existingUser.id,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return {
      accessToken,
      refreshToken,
      user: existingUser,
      nonActive: false,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
      const userDevices = await this.prisma.userDevice.findMany({
        where: { userId: payload.sub },
      });
      if (!userDevices.length) {
        throw new UnauthorizedException('No device found');
      }
      const matchedDevice = await Promise.any(
        userDevices.map(async (device) => {
          const isMatch = await bcrypt.compare(
            refreshToken,
            device.refreshTokenHash,
          );
          if (isMatch) return device;
          throw new Error();
        }),
      ).catch(() => null);

      if (!matchedDevice) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (matchedDevice.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          username: payload.username,
        },
        {
          secret: process.env.ACCESS_TOKEN,
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const existingUser = await this.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('Not found User');
    }

    if (!existingUser.email || !existingUser.username) {
      throw new InternalServerErrorException('User data invalid');
    }
    const token = this.jwtService.sign(
      {
        sub: existingUser.id,
        email: existingUser.email,
        type: 'reset',
      },
      {
        secret: process.env.RESET_TOKEN,
        expiresIn: '15m',
      },
    );

    await this.mailService.sendVerifyEmail(
      existingUser.email,
      existingUser.username,
      token,
    );

    return {
      message: existingUser.email,
    };
  }

  async resetPassword(
    newPassword: string,
    confirmNewPassword: string,
    payload: any,
  ) {
    if (!newPassword || !confirmNewPassword) {
      throw new BadRequestException('Missing password');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'New password does not match confirm password',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: {
        passwordHash: hashedPassword,
      },
    });
    return {
      message: 'Password reset successfully',
    };
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    token: string,
  ) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      });
      const existingUser = await this.findByEmail(payload.email);

      if (!existingUser) {
        throw new NotFoundException('Not found User');
      }

      console.log('old', oldPassword);
      console.log('current', existingUser.passwordHash);

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        existingUser.passwordHash,
      );

      console.log('oooooooooooooooooo', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (newPassword != confirmNewPassword) {
        throw new BadRequestException(
          'confirm password is not match new password',
        );
      }

      const saltRounds = 10;
      const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const email = payload.email;
      console.log(email);
      const data = await this.prisma.user.update({
        where: { email },
        data: {
          passwordHash: newHashedPassword,
        },
      });

      return { data };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async logout(refreshToken: string, res: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });

      const userDevices = await this.prisma.userDevice.findMany({
        where: { userId: payload.sub },
      });

      const matchedDevice = await Promise.any(
        userDevices.map(async (device) => {
          const isMatch = await bcrypt.compare(
            refreshToken,
            device.refreshTokenHash,
          );
          if (isMatch) return device;
          throw new Error();
        }),
      ).catch(() => null);

      if (matchedDevice) {
        await this.prisma.userDevice.delete({
          where: { id: matchedDevice.id },
        });
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return { message: 'Logout successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async activeAccount(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACTIVE_TOKEN,
      });
      const email = payload.email;

      const existingUser = await this.findByEmail(email);

      if (!existingUser) {
        throw new NotFoundException('Not found User');
      }

      if (existingUser.isActive) {
        throw new BadRequestException('Account is actived');
      }

      await this.prisma.user.update({
        where: { email },
        data: {
          isActive: true,
        },
      });

      return {
        messsage: 'Your Account is actived successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
