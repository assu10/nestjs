import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infra/db/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../../auth/auth.service';
import { IUserRepository } from '../../domain/repository/iuser.repository';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command;

    // DB 에 email, password 가진 유저 존재 여부 조회 후 없다면 에러 처리
    const user = await this.userRepository.findByEmailAndPassword(
      email,
      password,
    );

    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    // JWT 발급
    return this.authService.login({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });
  }
}
