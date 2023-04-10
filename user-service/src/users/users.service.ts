import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { EmailService } from '../email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,

    // UsersService 에 `@InjectRepository` 데커레이터로 유저 저장소 주입
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource, // TypeORM 에서 제공하는 DataSource 객체 주입
    private authService: AuthService,
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
    //await this.saveUser(name, email, password, signupVerifyToken);
    // await this.saveUserUsingQueryRunner(
    //   name,
    //   email,
    //   password,
    //   signupVerifyToken,
    // );
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    // 회원 가입 이메일 발송
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  // 가입 유무 확인
  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log('user: ', user);
    return user !== null;
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

  // 유저 정보 저장 - QueryRunner 로 트랜잭션 제어
  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    // 주입받은 DataSource 객체에서 QueryRunner 생성
    const queryRunner = this.dataSource.createQueryRunner();

    // QueryRunner 에 DB 연결 후 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new UserEntity(); // 유저 엔티티 객체 생성
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      // 트랜잭션을 커밋하여 영속화(persistence) 함
      await queryRunner.manager.save(user);

      // 일부러 에러 발생 시 데이터 저장 안됨
      // throw new InternalServerErrorException();

      // DB 작업 수행 수 커밋하여 영속화 완료
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러 발생 시 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner 해제
      await queryRunner.release();
    }
  }

  // 유저 정보 저장 - transaction 함수 직접 이용하여 트랜잭션 제어
  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity(); // 유저 엔티티 객체 생성
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // 일부러 에러 발생 시 데이터 저장 안됨
      //throw new InternalServerErrorException();
    });
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
    // DB 에 signupVerifyToken 으로 회원 가입 처리중인 유저가 있는지 조회 후 없다면 에러 처리
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    // 바로 로그인 상태가 되도록 JWT 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  // 로그인
  async login(email: string, password: string): Promise<string> {
    // DB 에 email, password 가진 유저 존재 여부 조회 후 없다면 에러 처리
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    // JWT 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  // 유저 정보 조회
  async getUserInfo(userId: string): Promise<UserInfo> {
    // DB 에 userId 가진 유저 존재 여부 조회 후 없다면 에러 처리
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    // 조회 데이터를 userInfo 타입으로 리턴
    return {
      id: userId,
      name: user.name,
      email: user.email,
    };
  }
}
