import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthencationModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { VideoModule } from './video/video.module';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthencationModule,
    ProfileModule,
    VideoModule
  ],
})
export class AppModule {}
