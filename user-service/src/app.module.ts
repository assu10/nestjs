import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig], // ConfigFactory 지정
      isGlobal: true, // 전역으로 등록해서 어느 모듈에서나 사용 가능
      validationSchema, // 환경 변수 값에 대해 유효성 검사 수행
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
