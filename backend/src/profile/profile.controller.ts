import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  NotFoundException,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProfileService } from './profile.service';
import { CheckUser } from './guards/checkUser.guard';
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(CheckUser)
  @Get('/')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return this.profileService.getProfile(token);
  }

  @UseGuards(CheckUser)
  @Post('/edit')
  async editProfile(
    @Body('username') username: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('description') description: string,
    @Req() req: any,
  ) {
    return this.profileService.editProfile(
      req.user,
      username,
      address,
      phone,
      description,
    );
  }

  @UseGuards(CheckUser)
  @Delete('/delete')
  async deleteProfile(@Req() req: any) {
    return this.profileService.deleteProfile(req.user);
  }
}
