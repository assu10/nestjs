import { IEmailService } from '../../application/adapter/iemail.service';
import { Injectable } from '@nestjs/common';
import { EmailService as ExternalEmailService } from 'src/email/email.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private emailService: ExternalEmailService) {}

  async sendMemberJoinVerification(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
