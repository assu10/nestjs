import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// dotenv 패키지 직접 사용
// dotenv.config({
//   path: path.resolve(
//     process.env.NODE_ENV === 'dev'
//       ? '.dev.env'
//       : process.env.NODE_ENV === 'stage'
//       ? '.stage.env'
//       : '.local.env',
//   ),
// });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
