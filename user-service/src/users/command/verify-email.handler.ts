import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/auth.service';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    //`@InjectRepository` 데커레이터로 유저 저장소 주입
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { signupVerifyToken } = command;
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
}
