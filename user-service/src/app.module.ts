import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import { ExceptionModule } from './exception/exception.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig], // ConfigFactory 지정
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
      synchronize: process.env.DATABASE_SYNCRONIZE === 'true', // 서비스 구동 시 소스 코드 기반으로 DB 스키마 동기화할지 여부, PROD 에서는 false 로 할 것
      migrationsRun: false, // 서버가 구동될 때 작성된 마이그레이션 파일을 기반으로 마이그레이션 수행할 지 여부 설정, false 로 하여 cli 명령어로 직접 입력하도록 함
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // 마이그레이션을 수행할 파일이 관리되는 경로, 디폴트 migrations
      migrationsTableName: 'migrations',
    }),
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각 표시
            utilities.format.nestLike('MyApp', {
              // 로그 출처인 appName('MyApp') 설정
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ExceptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
