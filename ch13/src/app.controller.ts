import {
  Controller,
  Get,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ErrorInterceptor } from './error.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(ErrorInterceptor)
  @Get()
  getHello(): string {
    throw new InternalServerErrorException();
    return this.appService.getHello();
  }
}
