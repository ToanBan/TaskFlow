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
  UploadedFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProfileService } from './profile.service';
import { CheckUser } from './guards/checkUser.guard';
import { ImageUpload } from 'src/common/image-upload.decorator';
import { MinioService } from 'src/miniO/minio.service';
import { extname } from 'path/win32';
@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(CheckUser)
  @Get('/')
  async getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user);
  }

  @UseGuards(CheckUser)
  @ImageUpload('avatar')
  @Post('/edit')
  async editProfile(
    @Body('username') username: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.profileService.editProfile(
      req.user,
      username,
      address,
      phone,
      description,
      file,
    );
  }

  @UseGuards(CheckUser)
  @Delete('/delete')
  async deleteProfile(@Req() req: any) {
    return this.profileService.deleteProfile(req.user);
  }
}
