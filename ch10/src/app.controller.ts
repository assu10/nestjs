import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.decorator';
import { UserData } from './user-data.decorator';

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

  @Get('/name')
  getHello2(@UserData('name') name: string): void {
    console.log('------', name);
  }

  @Get('/name3')
  getHello3(@UserData() name: string): void {
    console.log('------', name);
  }
}
