import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { UserFactory } from '../../domain/user.factory';
import { IUserRepository } from 'src/users/domain/repository/iuser.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    // IUserRepository 는 클래스가 아니므로 의존선 클래스로 주입받을 수 없음
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 주입받음
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    // 가입 유무 확인
    const user = await this.userRepository.findByEmail(email);
    if (user !== null) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const id = ulid();
    const signupVerifyToken = uuid.v1();

    // 유저 정보 저장
    await this.userRepository.save(
      id,
      name,
      email,
      password,
      signupVerifyToken,
    );

    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }
}
