import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MinioService } from 'src/miniO/minio.service';
import { VideoService } from './video.serivce';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');

@Processor('video-processing', {
  concurrency: 2,
})
export class VideoProcessor extends WorkerHost {
  constructor(
    private readonly minioService: MinioService,
    private readonly videoService: VideoService,
  ) {
    super();
  }

  private normalizeVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 23',
          '-c:a aac',
          '-b:a 128k',
          '-pix_fmt yuv420p',
        ])
        .format('mp4')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  private transcodeVideo(
    inputPath: string,
    outputPath: string,
    height: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(`?x${height}`)
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 23',
          '-c:a aac',
          '-b:a 128k',
        ])
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }


  private getVideoMetadata(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  async process(job: Job): Promise<any> {
    const { videoId, objectKey, videoType } = job.data;

    console.log('Bắt đầu xử lý video:', videoId);

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const originalPath = path.join(tmpDir, `${videoId}.${videoType}`);
    const normalizedPath = path.join(tmpDir, `${videoId}_normalized.mp4`);

    const TARGET_QUALITIES = [1080, 720, 480, 360];

    try {
      await this.videoService.updateStatus(videoId, 'PROCESSING');

      const objectStream = await this.minioService.getObject(objectKey);
      await pipeline(objectStream, fs.createWriteStream(originalPath));

      console.log('Download xong file gốc');

      console.log('Đang normalize về MP4...');
      await this.normalizeVideo(originalPath, normalizedPath);
      console.log('Normalize xong');

      const metadata = await this.getVideoMetadata(normalizedPath);

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === 'video',
      );

      if (!videoStream) {
        throw new Error('Không tìm thấy video stream');
      }

      const originalHeight = videoStream.height;
      console.log('Original height:', originalHeight);

      const createdFiles: string[] = [];

      for (const height of TARGET_QUALITIES) {
        if (originalHeight >= height) {
          const outputPath = path.join(tmpDir, `${videoId}_${height}p.mp4`);

          console.log(`Đang encode ${height}p...`);
          await this.transcodeVideo(normalizedPath, outputPath, height);

          console.log(`Encode xong ${height}p`);

          await this.minioService.uploadFromPath(
            `processed/${videoId}/${height}p.mp4`,
            outputPath,
          );

          createdFiles.push(outputPath);
        }
      }

      console.log('Upload xong tất cả quality');

      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath);
      }

      for (const file of createdFiles) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }

      await this.videoService.updateStatus(videoId, 'READY');

      console.log('Xử lý hoàn tất:', videoId);

      return true;
    } catch (error) {
      console.error('Lỗi xử lý video:', error);

      await this.videoService.updateStatus(videoId, 'FAILED');

      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath);
      }

      throw error;
    }
  }
}
