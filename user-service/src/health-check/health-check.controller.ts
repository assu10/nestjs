import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DogHealthIndicator } from './dog.health';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      // HttpHealthIndicator 가 제공하는 pingCheck() 를 통해 다른 서버가 잘 동작하고 있는지 확인
      // https://docs.nestjs.com 에 요청을 보내서 받은 응답을 첫 번째 인수인 nestjs-docss 에 준다는 의미
      () =>
        this.httpHealthIndicator.pingCheck(
          'nestjs-docss',
          'https://docs.nestjs.com',
        ),
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      () => this.dogHealthIndicator.isHealthy('dog'),
    ]);
  }
}
