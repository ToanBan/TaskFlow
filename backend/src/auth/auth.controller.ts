import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  NotFoundException,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthencationService } from './auth.service';
import type { Response, Request } from 'express';
import { ResetPasswordGuard } from './guards/resetpassword.guard';
@Controller('api/auth')
export class AuthencationController {
  constructor(private readonly authService: AuthencationService) {}

  @Post('register')
  register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.authService.register(
      username,
      email,
      password,
      confirmPassword,
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      email,
      password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, user };
  }

  @Post('refresh-token')
  async refresh(@Req() req: Request) {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException('No refresh token');
    }

    return this.authService.refreshToken(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    console.log('email backend', email);
    return this.authService.forgotPassword(email);
  }

  @UseGuards(ResetPasswordGuard)
  @Post('reset-password')
  async resetPassword(
    @Body('newPassword') newPassword: string,
    @Body('confirmNewPassword') confirmNewPassword: string,
    @Req() req: any,
  ) {
    return this.authService.resetPassword(
      newPassword,
      confirmNewPassword,
      req.resetUser, 
    );
  }

  @Post('change-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmNewPassword') confirmNewPassword: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    console.log('-------------------------', token);
    console.log({
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    return this.authService.changePassword(
      oldPassword,
      newPassword,
      confirmNewPassword,
      token,
    );
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException('No refresh token');
    }

    return this.authService.logout(token, res);
  }
}
