import { ServiceA } from './service-A';
import { Inject } from '@nestjs/common';

// 해당 클래스를 직접 참조하지 않으므로 @Injectable 선언하지 않음
export class BaseService {
  // 상속 관계에서 생성자 기반 주입을 받을 때
  //constructor(private readonly serviceA: ServiceA) {}

  // 상속 관계에서 속성 기반 주입을 받을 때
  @Inject(ServiceA)
  private readonly serviceA: ServiceA;

  getHello(): string {
    return 'Hello Base.';
  }

  doFromA(): string {
    return this.serviceA.getHello();
  }
}
