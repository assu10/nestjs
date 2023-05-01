import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 실행 콘텍스트에 포함된 첫 번째 객체를 가져옴 (이 객체로부터 요청 정보 얻을 수 있음)
    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`--Request to ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `--Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
            )}`,
          ),
        ),
      );
  }
}
