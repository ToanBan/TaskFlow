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
      const newVideo = await this.prisma.video.create({
        data: {
          title: title,
          description: description,
          thumbnailUrl: thumbnail.replace('vstream/', ''),
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

  async updateStatus(
    videoId: string,
    status: VideoStatus,
    processedUrl?: string,
  ) {
    try {
      const existingVideo = await this.findVideoById(Number(videoId));

      return await this.prisma.video.update({
        where: { id: existingVideo.id },
        data: { status: status, processedUrl: processedUrl },
      });
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async getVideo() {
    try {
      const videos = await this.prisma.video.findMany({
        where: { status: VideoStatus.READY },
        orderBy: { createdAt: 'desc' },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      return videos;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async getVideoById(contextUser: any) {
    try {
      const videos = await this.prisma.video.findMany({
        where: {
          userId: contextUser.sub,
          status: VideoStatus.READY,
        },
        orderBy: { createdAt: 'desc' },
      });
      return videos;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async deleteVideo(videoId: number) {
    try {
      await this.prisma.video.update({
        where: { id: videoId },
        data: { status: VideoStatus.FAILED },
      });
      return { message: 'Video deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }


  async getVideoDetail(videoId: number) {
    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      return video;
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
