import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { LoginHandler } from './command/login.handler';
import { UserEventHandler } from './event/user-event.handler';

const commandHandlers = [CreateUserHandler, VerifyEmailHandler, LoginHandler];
const eventHandlers = [UserEventHandler];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ], // UsersModule 에 forFeature() 로 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [...commandHandlers, ...eventHandlers, UsersService],
})
export class UsersModule {}
