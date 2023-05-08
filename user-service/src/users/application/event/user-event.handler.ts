import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from '../../domain/user-create.event';
import { Inject } from '@nestjs/common';
import { IEmailService } from '../adapter/iemail.service';

@EventsHandler(UserCreateEvent)
export class UserEventHandler implements IEventHandler<UserCreateEvent> {
  //constructor(private emailService: EmailService) {}
  constructor(@Inject('EmailService') private emailService: IEmailService) {}

  // 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있음
  async handle(event: UserCreateEvent) {
    switch (event.name) {
      case UserCreateEvent.name: {
        const { email, signupVerifyToken } = event as UserCreateEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
