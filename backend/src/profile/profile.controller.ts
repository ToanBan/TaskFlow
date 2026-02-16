import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  NotFoundException,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProfileService } from './profile.service';
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("/")
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return this.profileService.getProfile(token);
  }
}
