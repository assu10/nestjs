import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from './handler-roles.guard';
import { ClassRolesGuard } from './class-roles.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: HandlerRolesGuard },
    // { provide: APP_GUARD, useClass: ClassRolesGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
