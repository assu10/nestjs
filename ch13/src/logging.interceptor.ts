import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // NestInterceptor 인터페이스 구현

  // NestInterceptor 인터페이스의 intercept 함수 구현
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 요청이 전달되기 전 로그 출력
    console.log('Before log...');

    const now = Date.now();

    return (
      next
        .handle()
        // 요청을 처리한 후 로그 출력
        .pipe(tap(() => console.log(`After log... ${Date.now() - now} ms`)))
    );
  }
}
