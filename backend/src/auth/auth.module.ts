import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthencationController } from './auth.controller';
import { AuthencationService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
import { ResetPasswordGuard } from './guards/resetpassword.guard';
import { CheckUser } from 'src/profile/guards/checkUser.guard';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN,
      signOptions: { expiresIn: '15m' },
    }),

    MailModule,
  ],
  controllers: [AuthencationController],
  providers: [AuthencationService, ResetPasswordGuard, CheckUser],
  exports: [JwtModule],
})
export class AuthencationModule {}
