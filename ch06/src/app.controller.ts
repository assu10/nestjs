import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(): string {
    return process.env.DATABASE_HOST;
  }

  @Get('config')
  getConfig(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
