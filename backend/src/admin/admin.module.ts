import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthencationModule } from '../auth/auth.module';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthencationModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
