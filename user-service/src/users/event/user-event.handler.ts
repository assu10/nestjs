import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from './user-create.event';
import { TestEvent } from './test.event';
import { EmailService } from '../../email/email.service';
import { Injectable } from '@nestjs/common';

//@Injectable()
@EventsHandler(UserCreateEvent, TestEvent)
export class UserEventHandler
  implements IEventHandler<UserCreateEvent | TestEvent>
{
  constructor(private emailService: EmailService) {}

  // 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있음
  async handle(event: UserCreateEvent | TestEvent) {
    switch (event.name) {
      case UserCreateEvent.name: {
        console.log('--UserCreateEvent~');
        const { email, signupVerifyToken } = event as UserCreateEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      case TestEvent.name: {
        console.log('--TestEvent~');
        break;
      }
      default:
        break;
    }
  }
}
