import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  // 회원 가입
  async createUser(name: string, email: string, password: string) {
    // 가입 유무 확인
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();
    console.log('signupVerifyToken: ', signupVerifyToken);

    // 유저 정보 저장
    await this.saveUser(name, email, password, signupVerifyToken);

    // 회원 가입 이메일 발송
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  // 가입 유무 확인
  private async checkUserExists(email: string) {
    return false; // TODO: DB 연동 후 구현
  }

  // 유저 정보 저장
  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO: DB 연동 후 구현
  }

  // 회원 가입 이메일 발송
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  // 이메일 인증
  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO: DB 에 signupVerifyToken 으로 회원 가입 처리중인 유저가 있는지 조회 후 없다면 에러 처리
    // TODO: 바로 로그인 상태가 되도록 JWT 발급

    throw new Error('아직 미구현된 로직');
  }

  // 로그인
  async login(email: string, password: string): Promise<string> {
    // TODO: DB 에 email, password 가진 유저 존재 여부 조회 후 없다면 에러 처리
    // TODO: JWT 발급

    throw new Error('아직 미구현된 로직');
  }

  // 유저 정보 조회
  async getUserInfo(userId: string): Promise<UserInfo> {
    // TODO: DB 에 userId 가진 유저 존재 여부 조회 후 없다면 에러 처리
    // TODO: 조회 데이터를 userInfo 타입으로 리턴

    throw new Error('아직 미구현된 로직');
  }
}
