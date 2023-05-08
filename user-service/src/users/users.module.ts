import { Module } from '@nestjs/common';
import { UsersController } from './interface/users.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/command/create-user.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';
import { LoginHandler } from './application/command/login.handler';
import { UserEventHandler } from './application/event/user-event.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/UserRepository';
import { EmailService } from './infra/adapter/email.service';

const commandHandlers = [CreateUserHandler, VerifyEmailHandler, LoginHandler];
const eventHandlers = [UserEventHandler];
const queryHandlers = [GetUserInfoQueryHandler];

const factories = [UserFactory];
const repositories = [
  {
    provide: 'UserRepository',
    useClass: UserRepository,
  },
  { provide: 'EmailService', useClass: EmailService },
];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ], // UsersModule 에 forFeature() 로 유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...factories,
    ...repositories,
  ],
})
export class UsersModule {}
