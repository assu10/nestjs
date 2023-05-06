import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.decorator';

interface User {
  name: string;
  email: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@User() user: User): string {
    // User 커스텀 데커레이터 사용
    console.log('------', user);
    return this.appService.getHello();
  }
}
