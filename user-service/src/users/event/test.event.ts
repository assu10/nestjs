import { CqrsEvent } from '../domain/cqrs-event';
import { IEvent } from '@nestjs/cqrs';

// 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있기 때문에 예시로 생성
export class TestEvent extends CqrsEvent implements IEvent {
  constructor() {
    super(TestEvent.name); // CqrsEvent 의 constructor()
  }
}
