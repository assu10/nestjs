import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@UseGuards(AuthGuard) // 클래스에 가드 적용
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard) // 메서드에 가드 적용
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
