import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CheckAdminGuard } from './guards/checkadmin.guard';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/count-status-video')
  @UseGuards(CheckAdminGuard)
  async countStatusVideo() {
    return this.adminService.countStatusVideo();
  }

  @Get('/all-video')
  @UseGuards(CheckAdminGuard)
  async getAllVideo() {
    return this.adminService.getAllVideo();
  }

  @Delete('/videos/:id')
  @UseGuards(CheckAdminGuard)
  async deleteVideo(@Param('id') id: string) {
    console.log('id', id);
    return this.adminService.deleteVideo(Number(id))    ;
  }

  @Post('/videos/:id')
  @UseGuards(CheckAdminGuard)
  async blockVideo(@Param('id') id: string) {
    return this.adminService.openVideo(Number(id));
  }
}
