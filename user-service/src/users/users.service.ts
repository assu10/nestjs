import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { EmailService } from '../email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,

    // UsersService 에 `@InjectRepository` 데커레이터로 유저 저장소 주입
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // 회원 가입
  async createUser(name: string, email: string, password: string) {
    // 가입 유무 확인
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const signupVerifyToken = uuid.v1();
    console.log('signupVerifyToken: ', signupVerifyToken);

    // 유저 정보 저장
    await this.saveUser(name, email, password, signupVerifyToken);

    // 회원 가입 이메일 발송
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  // 가입 유무 확인
  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user !== undefined;
  }

  // 유저 정보 저장
  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity(); // 유저 엔티티 객체 생성
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
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
