import { Module } from '@nestjs/common';
import { AuthencationModule } from 'src/auth/auth.module';
import { VideoService } from './video.serivce';
import { VideoController } from './video.controller';
import { CheckUser } from 'src/profile/guards/checkUser.guard';
import { MinioService } from 'src/miniO/minio.service';
import { BullModule } from '@nestjs/bullmq';
import { VideoProcessor } from './video.processor';
@Module({
  imports: [
    AuthencationModule,
    BullModule.registerQueue({
      name: 'video-processing',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, CheckUser, MinioService, VideoProcessor],
})
export class VideoModule {}
