import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { VideoStatus } from '@prisma/client';
@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async saveMetadata(
    userId: number,
    title: string,
    description: string,
    thumbnail: string,
  ) {
    try {
      console.log('Saving video metadata with thumbnail URL:', userId, title, description, thumbnail);
      const newVideo = await this.prisma.video.create({
        data: {
          title: title,
          description: description,
          thumbnailUrl: thumbnail,
          user: {
            connect: { id: userId },
          },
        },
      });
      return newVideo;
    } catch (error) {
      console.error('Error saving video metadata:', error);
      throw new InternalServerErrorException('Lỗi khi lưu metadata video');
    }
  }

  async findVideoById(videoId: number) {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new NotFoundException('Not Found Video');
      }

      return video;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async updateStatus(videoId:string, status:VideoStatus){
    try {
      const existingVideo = await this.findVideoById(Number(videoId));
      
      return await this.prisma.video.update({
        where: { id: existingVideo.id },
        data: { status: status },
      });

      
    } catch (error) {
      throw new InternalServerErrorException("something went wrong")
    }
  }
}
