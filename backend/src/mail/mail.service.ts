import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerifyEmail(to: string, name: string, token:string) {
    const verifyUrl = `http://localhost:5173/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Xác thực tài khoản',
      template: 'verify',
      context: {
        name,
        verifyUrl,
      },
    });
  }
}