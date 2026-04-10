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
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });
  }

  private encodeHLS(inputPath: string, outputDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .addOptions([
          '-preset',
          'veryfast',
          '-g',
          '48',
          '-sc_threshold',
          '0',

          '-map',
          '0:v:0',
          '-map',
          '0:a:0?',

          '-c:v',
          'libx264',
          '-c:a',
          'aac',

          '-var_stream_map',
          'v:0,a:0',

          '-f',
          'hls',
          '-hls_time',
          '6',
          '-hls_playlist_type',
          'vod',
          '-hls_segment_filename',
          path.join(outputDir, 'segment_%03d.ts'),
        ])
        .output(path.join(outputDir, 'index.m3u8'))
        .on('end', resolve)
        .on('error', (err, stdout, stderr) => {
          console.log(stderr);
          reject(err);
        })
        .run();
    });
  }

  private async uploadDirectory(localDir: string, remoteBase: string) {
    const walk = (dir: string): string[] => {
      return fs.readdirSync(dir).flatMap((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          return walk(fullPath);
        }
        return [fullPath];
      });
    };

    const files = walk(localDir);

    for (const file of files) {
      const relativePath = path.relative(localDir, file).replace(/\\/g, '/');

      const objectKey = `${remoteBase}/${relativePath}`;
      await this.minioService.uploadFromPath(objectKey, file);
    }
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
    const hlsOutputDir = path.join(tmpDir, `${videoId}_hls`);

    try {
      await this.videoService.updateStatus(videoId, 'PROCESSING');

      const objectStream = await this.minioService.getObject(objectKey);
      await pipeline(objectStream, fs.createWriteStream(originalPath));

      console.log('Download xong file gốc');

      console.log('Đang normalize...');
      await this.normalizeVideo(originalPath, normalizedPath);
      console.log('Normalize xong');

      if (!fs.existsSync(hlsOutputDir)) {
        fs.mkdirSync(hlsOutputDir);
      }

      console.log('Đang encode HLS...');
      await this.encodeHLS(normalizedPath, hlsOutputDir);
      console.log('Encode HLS xong');

      await this.uploadDirectory(hlsOutputDir, `processed/${videoId}`);
      const processedUrl = `processed/${videoId}/index.m3u8`;
      console.log('Upload HLS xong');

  
      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(normalizedPath)) fs.unlinkSync(normalizedPath);
      if (fs.existsSync(hlsOutputDir))
        fs.rmSync(hlsOutputDir, { recursive: true, force: true });

      await this.videoService.updateStatus(videoId, 'READY', processedUrl);

      console.log('Xử lý hoàn tất:', videoId);

      return true;
    } catch (error) {
      console.error('Lỗi xử lý video:', error);

      await this.videoService.updateStatus(videoId, 'FAILED');

      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(normalizedPath)) fs.unlinkSync(normalizedPath);
      if (fs.existsSync(hlsOutputDir))
        fs.rmSync(hlsOutputDir, { recursive: true, force: true });

      throw error;
    }
  }
}
