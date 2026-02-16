import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthencationModule } from '../auth/auth.module';

@Module({
  imports: [AuthencationModule], 
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}