import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UnprocessableEntityException } from '@nestjs/common';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { UserCreateEvent } from '../event/user-create.event';
import { TestEvent } from '../event/test.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private dataSource: DataSource,
    private eventBus: EventBus,
    //`@InjectRepository` 데커레이터로 유저 저장소 주입
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;
    // 가입 유무 확인
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const signupVerifyToken = uuid.v1();
    console.log('--signupVerifyToken: ', signupVerifyToken);

    // 유저 정보 저장
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    // 회원 가입 이메일 발송
    this.eventBus.publish(new UserCreateEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
  }

  // 가입 유무 확인
  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log('--user: ', user);
    return user !== null;
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
}
