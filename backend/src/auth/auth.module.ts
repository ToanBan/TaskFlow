import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthencationController } from './auth.controller';
import { AuthencationService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN,
      signOptions: { expiresIn: '15m' },
    }),

    MailModule,
  ],
  controllers: [AuthencationController],
  providers: [AuthencationService],
  exports: [JwtModule],
})
export class AuthencationModule {}
