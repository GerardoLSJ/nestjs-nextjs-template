import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    try {
      const from =
        this.configService.get<string>('SMTP_FROM') || '"Auth App" <noreply@example.com>';
      const info = await this.transporter.sendMail({
        from,
        ...options,
      });

      this.logger.log(`Message sent: ${info.messageId}`);

      // Preview only available when sending through an Ethereal account
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Preview URL: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
