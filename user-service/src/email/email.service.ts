import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import emailConfig from '../config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
@Injectable()
export class EmailService {
  private transporter: Mail;

  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: 'test@gmail.com',
  //       pass: 'aaaaa',
  //     },
  //   });
  // }

  constructor(
    // 주입받을 때 @Inject 데커레이터의 토큰을 앞에서 만든 ConfigFactory 의 KEY 인 `email` 문자열로 넣어준다.
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service, // env 파일에 있는 값들
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  // 가입 인증 메일 발송
  async sendMemberJoinVerification(email: string, signupVerifyToken: string) {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: email,
      subject: '가입 인증 메일',
      html: `가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br />
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
