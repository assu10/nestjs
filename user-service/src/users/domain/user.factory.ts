import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserCreateEvent } from './user-create.event';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  // 유저 객체 생성
  create(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): User {
    // User 객체 생성 후 UserCreatedEvent 발행함, 이후 생성한 유저 도메인 객체 리턴
    const user = new User(id, name, email, password, signupVerifyToken);
    this.eventBus.publish(new UserCreateEvent(email, signupVerifyToken));
    return user;
  }

  // 이벤트 발행없이 유저 객체만 생성
  reconstitute(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    return new User(id, name, email, signupVerifyToken, password);
  }
}
