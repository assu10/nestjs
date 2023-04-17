import { Injectable } from '@nestjs/common';
import { MyloggerService } from './logging/mylogger.service';

@Injectable()
export class AppService {
  constructor(private myLogger: MyloggerService) {}
  getHello(): string {
    console.log(process.env.NODE_ENV);
    this.myLogger.error('test');
    this.myLogger.debug('test');

    return 'Hello World!';
  }
}
