import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { ServiceA } from './service-A';
import { ServiceB } from './service-B';
import { BaseService } from './base-service';

@Module({
  imports: [UsersModule],
  controllers: [ApiController, AppController],
  providers: [AppService, BaseService, ServiceA, ServiceB],
})
export class AppModule {}
