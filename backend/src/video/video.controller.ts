import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
  Param,
  NotFoundException,
  Get,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { VideoService } from './video.serivce';
import { CheckUser } from 'src/profile/guards/checkUser.guard';
import { MinioService } from 'src/miniO/minio.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageUpload } from 'src/common/image-upload.decorator';
@Controller('api/video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly minioService: MinioService,
    @InjectQueue('video-processing')
    private readonly videoQueue: Queue,
  ) {}

  @Post('addMetaVideo')
  @ImageUpload('feature_video')
  @UseGuards(CheckUser)
  async addMetaVideo(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('videoType') videoType: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Vui lòng tải lên ảnh đại diện (feature_video)',
      );
    }

    const thumbnailUrl = await this.minioService.uploadFile(file, 'thumbnails');

    const newVideo = await this.videoService.saveMetadata(
      req.user.sub,
      title,
      description,
      thumbnailUrl,
    );

    const objectKey = `videos/${newVideo.id}.${videoType}`;
    const presignedUploadUrl =
      await this.minioService.generatePresignedUploadUrl(objectKey);
    return {
      message: 'Khởi tạo video thành công',
      videoId: newVideo.id,
      presignedUploadUrl,
      objectKey,
    };
  }

  @Post(':id/confirm')
  @UseGuards(CheckUser)
  async confirmUpload(
    @Param('id') id: string,
    @Body('videoType') videoType: string,
  ) {
    const video = await this.videoService.findVideoById(Number(id));

    const objectKey = `videos/${id}.${videoType}`;

    await this.videoQueue.add('process-video', {
      videoId: Number(id),
      objectKey,
      videoType,
    });

    return {
      message: 'Video đang được xử lý',
    };
  }

  @Get('/')
  async getVideos() {
    const videos = await this.videoService.getVideo();
    return videos;
  }

  @Get('/myself')
  @UseGuards(CheckUser)
  async getMyVideos(@Req() req: any) {
    const videos = await this.videoService.getVideoById(req.user);

    return videos;
  }

  @Delete('/:id')
  @UseGuards(CheckUser)
  async deleteVideo(@Req() req: any, @Param('id') id: string) {
    const videoId = Number(id);
    const video = await this.videoService.findVideoById(videoId);
    if (video.userId !== req.user.sub) {
      throw new NotFoundException('Video not found or unauthorized');
    }
    await this.videoService.deleteVideo(videoId);
    return { message: 'Video deleted successfully' };
  }


  @Get('/:id')
  async getVideoById(@Param('id') id: string) {
    const videoId = Number(id);
    const video = await this.videoService.getVideoDetail(videoId);
    if(!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }
}
