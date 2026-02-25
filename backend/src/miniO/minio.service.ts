import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as Minio from 'minio';
import { extname } from 'path';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName = 'vstream';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async onModuleInit() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: [`arn:aws:s3:::${this.bucketName}`],
          },
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
    }
  }

  async generatePresignedUploadUrl(objectKey: string) {
    return await this.minioClient.presignedPutObject(
      this.bucketName,
      objectKey,
      60 * 10,
    );
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      return `${this.bucketName}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Không thể tải file lên MinIO');
    }
  }

  async uploadFromPath(objectName: string, filePath: string) {
    try {
      await this.minioClient.fPutObject(this.bucketName, objectName, filePath);

      return `${this.bucketName}/${objectName}`;
    } catch (error) {
      throw new InternalServerErrorException('Upload processed file failed');
    }
  }

  async getObject(objectKey: string) {
    return await this.minioClient.getObject(this.bucketName, objectKey);
  }

  async fileExists(objectKey: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, objectKey);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw new InternalServerErrorException('Error checking file existence');
    }
  }

  async deleteObject(objectKey: string) {
    try {
      await this.minioClient.removeObject(this.bucketName, objectKey);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Delete file failed');
    }
  }

  async uploadWithKey(objectKey: string, file: Express.Multer.File) {
    await this.minioClient.putObject(
      this.bucketName,
      objectKey,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    return `${this.bucketName}/${objectKey}`;
  }
}
