import { CqrsEvent } from './cqrs-event';
import { IEvent } from '@nestjs/cqrs';

// CqrsEvent 와 TestEvent 상속받음
// CqrsEvent 는 이벤트 핸들러에서 이벤트를 구분하기 위해 만든 추상 클래스
export class UserCreateEvent extends CqrsEvent implements IEvent {
  constructor(readonly email: string, readonly signupVerifyToken: string) {
    super(UserCreateEvent.name); // CqrsEvent 의 constructor()
  }
}
