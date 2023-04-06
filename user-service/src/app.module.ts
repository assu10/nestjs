import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig], // ConfigFactory 지정
      isGlobal: true, // 전역으로 등록해서 어느 모듈에서나 사용 가능
      validationSchema, // 환경 변수 값에 대해 유효성 검사 수행
    }),
    //TypeORMModule 을 동적으로 가져옴
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 13306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // TypeORM 이 구동될 때 인식하도록 할 entity 클래스의 경로 지정
      synchronize: true, // 서비스 구동 시 소스 코드 기반으로 DB 스키마 동기화할지 여부, PROD 에서는 false 로 할 것
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
