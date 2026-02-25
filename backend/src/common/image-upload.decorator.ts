import { applyDecorators, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function ImageUpload(fieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(
              new BadRequestException(
                'Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!',
              ),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      }),
    ),
  );
}