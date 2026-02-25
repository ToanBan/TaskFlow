import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthencationModule } from '../auth/auth.module';
import { CheckUser } from './guards/checkUser.guard';
import { MinioService } from 'src/miniO/minio.service';
@Module({
  imports: [AuthencationModule],
  controllers: [ProfileController],
  providers: [ProfileService, CheckUser, MinioService],
})
export class ProfileModule {}
