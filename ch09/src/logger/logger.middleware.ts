import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    //res.send('DONE'); // 이 부분을 주석 해제하고 next() 를 주석처리하면 미들웨어 수행 중단
    next(); // res.send() 와 next() 를 주석 처리하면 애플리케이션은 hanging 상태가 됨
  }
}
