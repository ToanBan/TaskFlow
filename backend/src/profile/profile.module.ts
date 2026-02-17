import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthencationModule } from '../auth/auth.module';
import { CheckUser } from './guards/checkUser.guard';
@Module({
  imports: [AuthencationModule],
  controllers: [ProfileController],
  providers: [ProfileService, CheckUser],
})
export class ProfileModule {}
