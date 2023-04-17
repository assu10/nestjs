import { ConsoleLogger, LoggerService } from '@nestjs/common';

// export class MyloggerService implements LoggerService {
//   debug(message: any, ...optionalParams: any[]): any {
//     console.log(message);
//   }
//
//   error(message: any, ...optionalParams: any[]): any {
//     console.log(message);
//   }
//
//   log(message: any, ...optionalParams: any[]): any {
//     console.log(message);
//   }
//
//   verbose(message: any, ...optionalParams: any[]): any {
//     console.log(message);
//   }
//
//   warn(message: any, ...optionalParams: any[]): any {
//     console.log(message);
//   }
// }

export class MyloggerService extends ConsoleLogger {
  error(message: any, ...optionalParams: [...any, string?]) {
    super.error(`${message}...!!!`, ...optionalParams);
    this.doSomething();
  }

  log(message: any, ...optionalParams: [...any, string?]) {
    super.log(`${message}...!!`, ...optionalParams);
    this.doSomething();
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직을 추가합니다.
    // ex. DB에 저장
  }
}
