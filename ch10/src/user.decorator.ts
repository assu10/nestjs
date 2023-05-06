import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  // createParamDecorator 를 이용하여 User Decorator 선언
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // 실행 콘텍스트에서 요청 객체 얻어옴
    return request.user; // AuthGuard 에서 설정한 유저 객체 반환, req.user 가 타입이 any 였다면 User 라는 타입을 갖게 됨
  },
);
