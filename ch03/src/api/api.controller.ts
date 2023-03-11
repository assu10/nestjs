import { Controller, Get, HostParam } from '@nestjs/common';

//@Controller({ host: 'api.test.com' })  로컬 테스트를 위해
//@Controller({ host: 'api.localhost' })
@Controller({ host: ':version.api.localhost' })
export class ApiController {
  // @Get() // app.controller.ts 와 같은 루트경로
  // getHello(): string {
  //   return 'hello Api'; // 다른 응답
  // }

  @Get() // app.controller.ts 와 같은 루트경로
  getHello(@HostParam('version') version: string): string {
    return `hello Api ${version}`; // 다른 응답
  }
}
