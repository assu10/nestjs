import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyloggerService } from './logging/mylogger.service';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);

  // 로그 비활성화
  // const app = await NestFactory.create(AppModule, {
  //   logger: false,
  // });

  // 로그 레벨 지정 (PROD 환경은 log 레벨 이상, 그 외 환경은 debug 레벨 이상 로그 출력
  // const app = await NestFactory.create(AppModule, {
  //   logger:
  //     process.env.NODE_ENV === 'local' ? ['error', 'warn', 'log'] : ['debug'],
  // });

  // 커스텀 로거 전역으로 사용
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 이 설정이 없으면 NestJS 앱이 구동되는 초반에 잠시동안 내장 로거가 사용됨
  });
  app.useLogger(app.get(MyloggerService));
  await app.listen(3000);
}
bootstrap();
