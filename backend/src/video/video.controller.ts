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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { VideoService } from './video.serivce';
import { CheckUser } from 'src/profile/guards/checkUser.guard';
import { MinioService } from 'src/miniO/minio.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Controller('api/video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly minioService: MinioService,
    @InjectQueue('video-processing')
    private readonly videoQueue: Queue,
  ) {}

  @Post('addMetaVideo')
  @UseInterceptors(
    FileInterceptor('feature_video', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận file ảnh (jpg, png, webp)!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
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
}
